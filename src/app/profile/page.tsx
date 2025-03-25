"use client";

import { Layout } from "@/layout/Layout";
import { ProfileForm } from "../profile/form/ProfileForm";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

interface Props {
  session: Session | null;
}

const ProfilePage: React.FC<Props> = ({ session }) => {
  return (
    <SessionProvider session={session}>
      <Layout session={session}>
        <section className="py-16 md:py-24">
          <div className="container px-4 mx-auto">
            <ProfileForm />
          </div>
        </section>
      </Layout>
    </SessionProvider>
  );
};

export default ProfilePage;
