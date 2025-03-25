"use client";

import { Layout } from "@/layout/Layout";
import { GistForm } from "../new/GistForm";

const NewGistPage = () => {
  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container px-4 mx-auto">
          <GistForm />
        </div>
      </section>
    </Layout>
  );
};

export default NewGistPage;
