import { AuthOptions, Account, Profile } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import connectionToDatabase from "@/lib/mongodb";
import User from "@/models/users";

declare module "next-auth" {

  interface User {
      login?: string;
      id: string;
      githubId?: string;
  }
  interface Session {
      user: {
          id: string;
          email: string;
          name?: string;
          image?: string;
      };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
      id: string;
      email: string;
      name?: string;
      image?: string;
      githubId?: string;
  }
}

export const authOptions: AuthOptions = {
  session: {
      strategy: "jwt",
  },
  providers: [
      GithubProvider({
          clientId: process.env.GITHUB_ID as string,
          clientSecret: process.env.GITHUB_SECRET as string,
          profile(profile) {
              return {
                  id: profile.id.toString(),
                  githubId: profile.id.toString(),
                  name: profile.login,
                  email: profile.email,
                  image: profile.avatar_url,
              };
          },
      }),
      CredentialsProvider({
          name: "Credentials",
          credentials: {
              email: { label: "Email", type: "email" },
              password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
              try {
                  await connectionToDatabase();

                  if (!credentials?.email || !credentials?.password) {
                      throw new Error("Missing credentials");
                  }

                  const user = await User.findOne({
                      email: credentials.email,
                  }).select("+password");

                  if (!user) {
                      throw new Error("User not found");
                  }

                  const isValidPassword = await bcrypt.compare(
                      credentials?.password ?? "",
                      user.password as string
                  );
                  if (!isValidPassword) {
                      throw new Error("Invalid credentials");
                  }

                  return {
                      id: user.id.toString(),
                      email: user.email,
                      name: user.name,
                      image: user.avatar,
                  };
              } catch (error) {
                  console.error("Authentication error:", error);
                  return null;
              }
          },
      }),
  ],
  callbacks: {
      async signIn({
          account,
          profile,
      }: {
          account?: Account | null;
          profile?: Profile | undefined;
      }) {
          if (account?.provider === "github") {
              try {
                  await connectionToDatabase();

                  const githubProfile = profile as {
                      email?: string;
                      name?: string;
                      login?: string;
                      id?: number;
                      avatar_url?: string;
                  };

                  if (!githubProfile.email) {
                      console.error("GitHub account email is required");
                      return false;
                  }

                  let user = await User.findOne({
                      $or: [
                          { email: githubProfile.email },
                          { githubId: githubProfile.id?.toString() },
                      ],
                  });

                  if (!user) {
                      user = await User.create({
                          name: githubProfile.name || githubProfile.login,
                          email: githubProfile.email,
                          githubId: githubProfile.id?.toString(),
                          avatar: githubProfile.avatar_url,
                      });
                  }

                  return true; // ✅ Ensure it returns only `true` or `false`
              } catch (error) {
                  console.error("GitHub sign-in error:", error);
                  return false;
              }
          }
          return true;
      },

      async jwt({ token, user }) {
          if (user) {
              token.id = user.id;
              token.email = user.email || "";
              token.name = user.name || "";
              token.image = user.image || "";
              token.githubId = user.githubId;
          }
          return token;
      },

      async session({ session, token }) {
          if (token) {
              session.user = {
                  id: token.id,
                  email: token.email,
                  name: token.name,
                  image: token.image,
              };
          }
          return session;
      },
  },
  pages: {
      signIn: "/sign-in",
      error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};