import React from 'react';
import Image from 'next/image';
import { Card } from '@repo/ui/card';

type TestimonialProps = {
  quote: string;
  author: string;
  role: string;
  platform: string;
  avatarSrc: string;
};

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, role, platform, avatarSrc }) => {
  return (
    <Card className="p-6 md:p-8 border border-border bg-background h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className="w-5 h-5 text-yellow-500 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        <p className="text-foreground mb-6 italic">&ldquo;{quote}&rdquo;</p>
      </div>
      <div className="flex items-center mt-4">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-4 bg-muted flex-shrink-0">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 to-accent/30" />
            {/* Using initials as avatars instead of images to avoid missing image errors */}
            <div className="w-full h-full flex items-center justify-center font-semibold text-foreground">
              {author.charAt(0)}
            </div>
          </div>
        </div>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">
            {role} • {platform}
          </p>
        </div>
      </div>
    </Card>
  );
};

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "Better Made Tech's Winner Spinner completely transformed how I do giveaways on my streams. My viewers love the excitement it brings!",
      author: "AlexStreams",
      role: "Twitch Partner",
      platform: "50K followers",
      avatarSrc: "/images/testimonials/avatar1.jpg"
    },
    {
      quote: "I've tried many streaming tools, but nothing comes close to the customization and reliability of these widgets. Worth every penny.",
      author: "TechGamersTV",
      role: "YouTube Creator",
      platform: "120K subscribers",
      avatarSrc: "/images/testimonials/avatar2.jpg"
    },
    {
      quote: "The browser extension is a game-changer. I can control everything without switching between applications. Incredibly smooth.",
      author: "StreamQueen",
      role: "Content Creator",
      platform: "Facebook Gaming",
      avatarSrc: "/images/testimonials/avatar3.jpg"
    }
  ];

  return (
    <div className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by Content Creators</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what streamers and creators are saying about our tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              platform={testimonial.platform}
              avatarSrc={testimonial.avatarSrc}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap justify-center gap-8 md:gap-16">
            {['Twitch', 'YouTube', 'Facebook Gaming', 'TikTok', 'OBS Studio', 'StreamLabs'].map((platform) => (
              <div key={platform} className="text-muted-foreground opacity-70 hover:opacity-100 transition-opacity">
                <p className="font-semibold tracking-wide">{platform}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};