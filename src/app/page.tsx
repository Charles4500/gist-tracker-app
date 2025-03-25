// import { useRouter } from "next/navigation";
"use client";
import { Layout } from "@/layout/Layout";
import { FileText, Code, Star, Users } from "lucide-react";

const HomePage = () => {
  const features = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Manage Code Snippets",
      description:
        "Create, edit, and organize your code snippets in one place.",
    },
    {
      icon: <Code className="h-5 w-5" />,
      title: "Multiple Languages",
      description:
        "Support for all major programming languages with syntax highlighting.",
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Star Favorites",
      description: "Bookmark your favorite gists for quick access later.",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Community Sharing",
      description: "Share your code with others and discover useful snippets.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-violet-50 dark:from-slate-950 dark:to-indigo-950 -z-10"></div>
        <div className="container px-4 mx-auto relative">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-20 animate-fade-down">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Store and share your code{" "}
              <span className="text-primary">beautifully</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              A minimalist platform for developers to create, manage, and share
              code snippets. Simple, elegant, and powerful.
            </p>
          </div>

          {/* Floating code card */}
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-70 dark:bg-blue-900"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-violet-100 rounded-full blur-3xl opacity-70 dark:bg-violet-900"></div>

            <div className="relative glass-card border border-white/20 p-6 rounded-lg shadow-lg animate-scale-in">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="flex-1 text-xs text-center text-muted-foreground">
                  example.tsx
                </div>
              </div>
              <pre className="text-sm overflow-x-auto p-4 bg-slate-800 text-slate-100 rounded-md">
                <code>{`import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(prev => prev + 1);
  
  return (
    <div className="center">
      <h2>Count: {count}</h2>
      <button onClick={increment}>Increment</button>
    </div>
  );
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything you need to manage your code
            </h2>
            <p className="text-muted-foreground">
              Simple yet powerful features designed for developers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 rounded-lg border border-transparent hover:border-primary/20 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Gists Section */}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-slate-950 dark:to-indigo-950">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our community of developers and start organizing your code
              snippets today.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
