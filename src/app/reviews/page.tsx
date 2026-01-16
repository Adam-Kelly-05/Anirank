import React from "react";
import ReviewsList from "@/components/ReviewsList";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-accent/15 via-primary/25 to-accent/10 py-12 border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <div className="h-10 w-2 bg-accent rounded-full mr-4"></div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text">
              Reviews & Ratings
            </h1>
          </div>
          <p className="text-lg text-foreground/80 ml-6">
            Read community reviews and share your thoughts
          </p>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ReviewsList />
        </div>
      </section>
    </div>
  );
}
