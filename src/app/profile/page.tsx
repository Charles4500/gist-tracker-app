"use client";

import { Layout } from "@/layout/Layout";
import { ProfileForm } from "../profile/form/ProfileForm";





const ProfilePage = () => {
  return (
   
      <Layout >
        <section className="py-16 md:py-24">
          <div className="container px-4 mx-auto">
            <ProfileForm />
          </div>
        </section>
      </Layout>
   
  );
};

export default ProfilePage;
