export type FieldType = 'text' | 'rich_text' | 'image_url'

export interface FieldDefinition {
  type: FieldType
  label: string
  placeholder?: string
}

export interface SectionDefinition {
  label: string
  fields: Record<string, FieldDefinition>
}

export interface PageDefinition {
  label: string
  slug: string
  sections: Record<string, SectionDefinition>
}

export const pageRegistry: Record<string, PageDefinition> = {
  home: {
    label: 'Home',
    slug: '/',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'rich_text', label: 'Hero Title', placeholder: 'Book trusted help for your home — fast.' },
          subtitle: { type: 'rich_text', label: 'Hero Subtitle', placeholder: 'Assembly, repairs, cleaning, moving, and more—handled by vetted pros, scheduled when it suits you, and paid securely in one place.' },
          search_placeholder: { type: 'text', label: 'Search Placeholder', placeholder: 'What do you need help with?' },
          empty_search_label: { type: 'text', label: 'Empty Search Link Label', placeholder: 'browse all services' },
        },
      },
      testimonials: {
        label: 'Testimonials',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'See What Happy Customers are Saying About 100 Handy' },
          item_1_name: { type: 'text', label: 'Testimonial 1 Name', placeholder: 'Luka K.' },
          item_1_text: { type: 'rich_text', label: 'Testimonial 1 Text', placeholder: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born...' },
          item_2_name: { type: 'text', label: 'Testimonial 2 Name', placeholder: 'Dasha K.' },
          item_2_text: { type: 'rich_text', label: 'Testimonial 2 Text', placeholder: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born...' },
          item_3_name: { type: 'text', label: 'Testimonial 3 Name', placeholder: 'Berkay M.' },
          item_3_text: { type: 'rich_text', label: 'Testimonial 3 Text', placeholder: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born...' },
          item_4_name: { type: 'text', label: 'Testimonial 4 Name', placeholder: 'Yuan L.' },
          item_4_text: { type: 'rich_text', label: 'Testimonial 4 Text', placeholder: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born...' },
          item_5_name: { type: 'text', label: 'Testimonial 5 Name', placeholder: 'Rodrigo S.' },
          item_5_text: { type: 'rich_text', label: 'Testimonial 5 Text', placeholder: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born...' },
          item_6_name: { type: 'text', label: 'Testimonial 6 Name', placeholder: 'Lisa S.' },
          item_6_text: { type: 'rich_text', label: 'Testimonial 6 Text', placeholder: 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born...' },
          badge_1_label: { type: 'text', label: 'Badge 1 Label', placeholder: 'Excellent' },
          badge_2_label: { type: 'text', label: 'Badge 2 Label', placeholder: 'Trustpilot' },
          badge_2_title: { type: 'text', label: 'Badge 2 Title', placeholder: 'My company worked amazingly' },
          badge_2_subtitle: { type: 'text', label: 'Badge 2 Subtitle', placeholder: 'from here and' },
          badge_3_label: { type: 'text', label: 'Badge 3 Label', placeholder: 'Great' },
          badge_3_title: { type: 'text', label: 'Badge 3 Title', placeholder: 'Someone really trusts us' },
          badge_3_subtitle: { type: 'text', label: 'Badge 3 Subtitle', placeholder: 'impressions 7 hours ago' },
        },
      },
      guarantees: {
        label: 'Guarantees',
        fields: {
          title: { type: 'rich_text', label: 'Section Title', placeholder: 'Peace of Mind, Always' },
          item_1_title: { type: 'text', label: 'Guarantee 1 Title', placeholder: 'Satisfaction Guaranteed' },
          item_1_description: { type: 'rich_text', label: 'Guarantee 1 Description', placeholder: "We stand by our work. If you're not happy, we'll do everything we can to make it right." },
          item_2_title: { type: 'text', label: 'Guarantee 2 Title', placeholder: 'Happiness Pledge' },
          item_2_description: { type: 'rich_text', label: 'Guarantee 2 Description', placeholder: "Your peace of mind matters. We're committed to delivering a service that leaves you smiling every time." },
          item_3_title: { type: 'text', label: 'Guarantee 3 Title', placeholder: 'ID-Checked Pros' },
          item_3_description: { type: 'rich_text', label: 'Guarantee 3 Description', placeholder: "Every professional on our platform is identity-verified before they join—so you can trust who's coming to your home." },
          item_4_title: { type: 'text', label: 'Guarantee 4 Title', placeholder: 'Dedicated Support' },
          item_4_description: { type: 'rich_text', label: 'Guarantee 4 Description', placeholder: 'Need a hand or have a question? Our friendly support team is here for you, every day of the week.' },
        },
      },
      get_help: {
        label: 'Get Help Today',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Get Help Today' },
          cta_text: { type: 'text', label: 'See All Link', placeholder: 'See All Services' },
          item_1_name: { type: 'text', label: 'Service 1 Name', placeholder: 'Furniture Assembly' },
          item_1_link: { type: 'text', label: 'Service 1 Link', placeholder: '/services/furniture-assembly/furniture-assembly' },
          item_2_name: { type: 'text', label: 'Service 2 Name', placeholder: 'TV Mounting' },
          item_2_link: { type: 'text', label: 'Service 2 Link', placeholder: '/services/tv-wall-mounting/tv-mounting' },
          item_3_name: { type: 'text', label: 'Service 3 Name', placeholder: 'Install Curtains and Blinds' },
          item_3_link: { type: 'text', label: 'Service 3 Link', placeholder: '/services/tv-wall-mounting/curtains-and-blinds' },
          item_4_name: { type: 'text', label: 'Service 4 Name', placeholder: 'Plumbing' },
          item_4_link: { type: 'text', label: 'Service 4 Link', placeholder: '/services/plumbing/leak-fixing' },
          item_5_name: { type: 'text', label: 'Service 5 Name', placeholder: 'Light Installation' },
          item_5_link: { type: 'text', label: 'Service 5 Link', placeholder: '/services/electrical/light-installation' },
          item_6_name: { type: 'text', label: 'Service 6 Name', placeholder: 'Deep Cleaning' },
          item_6_link: { type: 'text', label: 'Service 6 Link', placeholder: '/services/cleaning/deep-clean' },
          item_7_name: { type: 'text', label: 'Service 7 Name', placeholder: 'Gardening' },
          item_7_link: { type: 'text', label: 'Service 7 Link', placeholder: '/services/outdoor/gardening' },
          item_8_name: { type: 'text', label: 'Service 8 Name', placeholder: 'Gutter Cleaning' },
          item_8_link: { type: 'text', label: 'Service 8 Link', placeholder: '/services/outdoor/roof-gutter-cleaning' },
          item_9_name: { type: 'text', label: 'Service 9 Name', placeholder: 'Hang Pictures' },
          item_9_link: { type: 'text', label: 'Service 9 Link', placeholder: '/services/tv-wall-mounting/hanging-pictures' },
          item_10_name: { type: 'text', label: 'Service 10 Name', placeholder: 'IKEA Assembly' },
          item_10_link: { type: 'text', label: 'Service 10 Link', placeholder: '/services/furniture-assembly/ikea-assembly' },
          item_11_name: { type: 'text', label: 'Service 11 Name', placeholder: 'Wardrobe Assembly' },
          item_11_link: { type: 'text', label: 'Service 11 Link', placeholder: '/services/furniture-assembly/wardrobe-assembly' },
          item_12_name: { type: 'text', label: 'Service 12 Name', placeholder: 'Home Repairs' },
          item_12_link: { type: 'text', label: 'Service 12 Link', placeholder: '/services/home-repairs/home-repairs' },
        },
      },
    },
  },
  welcome: {
    label: 'Welcome',
    slug: '/welcome',
    sections: {
      hero: {
        label: 'Welcome Screen',
        fields: {
          background_image: { type: 'image_url', label: 'Background Image', placeholder: '/assets/welcome.png' },
          welcome_text: { type: 'text', label: 'Welcome Text', placeholder: 'Welcome to 100 Handy' },
          sign_up_text: { type: 'text', label: 'Sign Up Button Text', placeholder: 'Sign up' },
          log_in_text: { type: 'text', label: 'Log In Button Text', placeholder: 'Log in' },
          terms_prefix: { type: 'text', label: 'Terms Intro', placeholder: 'By signing up, you agree to the' },
          privacy_prefix: { type: 'text', label: 'Privacy Intro', placeholder: 'and have reviewed the' },
          cookie_prefix: { type: 'text', label: 'Cookie Intro', placeholder: 'Manage' },
        },
      },
    },
  },
  'sign-in': {
    label: 'Sign In',
    slug: '/sign-in',
    sections: {
      hero: {
        label: 'Sign In Screen',
        fields: {
          background_image: { type: 'image_url', label: 'Background Image', placeholder: '/images/signup-bg.jpg' },
          email_label: { type: 'text', label: 'Email Label', placeholder: 'Email Address' },
          email_placeholder: { type: 'text', label: 'Email Placeholder', placeholder: 'Email Address' },
          password_label: { type: 'text', label: 'Password Label', placeholder: 'Password' },
          password_placeholder: { type: 'text', label: 'Password Placeholder', placeholder: 'Password' },
          forgot_password_text: { type: 'text', label: 'Forgot Password Text', placeholder: 'Forgot password?' },
          submit_text: { type: 'text', label: 'Submit Button Text', placeholder: 'Log in' },
          oauth_divider_text: { type: 'text', label: 'OAuth Divider Text', placeholder: 'Or continue with' },
          google_text: { type: 'text', label: 'Google Button Text', placeholder: 'Google' },
          apple_text: { type: 'text', label: 'Apple Button Text', placeholder: 'Apple' },
          signup_prompt: { type: 'text', label: 'Sign Up Prompt', placeholder: "Don't have an account?" },
          signup_link_text: { type: 'text', label: 'Sign Up Link Text', placeholder: 'Sign Up' },
          terms_text: { type: 'rich_text', label: 'Terms Text', placeholder: 'I agree to the Terms of Service and have reviewed the Privacy Policy.' },
        },
      },
    },
  },
  'sign-up': {
    label: 'Sign Up',
    slug: '/sign-up',
    sections: {
      hero: {
        label: 'Sign Up Screen',
        fields: {
          background_image: { type: 'image_url', label: 'Background Image', placeholder: '/images/signup-bg.jpg' },
          oauth_divider_text: { type: 'text', label: 'OAuth Divider Text', placeholder: 'Or sign up with email' },
          google_text: { type: 'text', label: 'Google Button Text', placeholder: 'Google' },
          apple_text: { type: 'text', label: 'Apple Button Text', placeholder: 'Apple' },
          phone_help_text: { type: 'rich_text', label: 'Phone/Postcode Help Text', placeholder: 'Your phone and postcode help us match and connect you with the right 100 Handy Pros.' },
          terms_text: { type: 'rich_text', label: 'Terms Checkbox Text', placeholder: 'I agree to the Terms of Service and have reviewed the Privacy Policy.' },
          marketing_opt_out_text: { type: 'text', label: 'Marketing Opt-out Text', placeholder: 'I do not want to receive promotional emails and notifications from 100Handy' },
          submit_text: { type: 'text', label: 'Submit Button Text', placeholder: 'Create account' },
          sign_in_prompt: { type: 'text', label: 'Sign In Prompt', placeholder: 'Already have an account?' },
          sign_in_link_text: { type: 'text', label: 'Sign In Link Text', placeholder: 'Sign In' },
        },
      },
    },
  },
  'forgot-password': {
    label: 'Forgot Password',
    slug: '/forgot-password',
    sections: {
      hero: {
        label: 'Forgot Password Screen',
        fields: {
          background_image: { type: 'image_url', label: 'Background Image', placeholder: '/images/signup-bg.jpg' },
          back_text: { type: 'text', label: 'Back Text', placeholder: 'Back to Sign In' },
          title: { type: 'text', label: 'Title', placeholder: 'Forgot your password?' },
          description: { type: 'rich_text', label: 'Description', placeholder: "Enter your email address and we'll send you a verification code to reset your password." },
          email_label: { type: 'text', label: 'Email Label', placeholder: 'Email Address' },
          email_placeholder: { type: 'text', label: 'Email Placeholder', placeholder: 'Enter your email address' },
          submit_text: { type: 'text', label: 'Submit Button Text', placeholder: 'Send Verification Code' },
          sign_in_prompt: { type: 'text', label: 'Sign In Prompt', placeholder: 'Remember your password?' },
          sign_in_link_text: { type: 'text', label: 'Sign In Link Text', placeholder: 'Sign In' },
          help_text: { type: 'text', label: 'Help Text', placeholder: 'Need help?' },
        },
      },
    },
  },
  'reset-password': {
    label: 'Reset Password',
    slug: '/reset-password',
    sections: {
      hero: {
        label: 'Reset Password Screen',
        fields: {
          background_image: { type: 'image_url', label: 'Background Image', placeholder: '/images/signup-bg.jpg' },
          title: { type: 'text', label: 'Title', placeholder: 'Reset your password' },
          description: { type: 'text', label: 'Description', placeholder: 'Enter your new password below.' },
          password_label: { type: 'text', label: 'New Password Label', placeholder: 'New Password' },
          password_placeholder: { type: 'text', label: 'New Password Placeholder', placeholder: 'Enter new password' },
          confirm_password_label: { type: 'text', label: 'Confirm Password Label', placeholder: 'Confirm Password' },
          confirm_password_placeholder: { type: 'text', label: 'Confirm Password Placeholder', placeholder: 'Confirm new password' },
          password_requirements: { type: 'text', label: 'Password Requirements Text', placeholder: 'Password must be at least 8 characters long and contain uppercase, lowercase, and numbers' },
          submit_text: { type: 'text', label: 'Submit Button Text', placeholder: 'Reset Password' },
          sign_in_prompt: { type: 'text', label: 'Sign In Prompt', placeholder: 'Remember your password?' },
          sign_in_link_text: { type: 'text', label: 'Sign In Link Text', placeholder: 'Sign In' },
          success_title: { type: 'text', label: 'Success Title', placeholder: 'Password reset successful!' },
          success_description: { type: 'rich_text', label: 'Success Description', placeholder: 'Your password has been successfully reset.<br />You can now sign in with your new password.' },
          success_cta_text: { type: 'text', label: 'Success CTA Text', placeholder: 'Go to Sign In' },
          help_text: { type: 'text', label: 'Help Text', placeholder: 'Need help?' },
        },
      },
    },
  },
  'verify-code': {
    label: 'Verify Code',
    slug: '/verify-code',
    sections: {
      hero: {
        label: 'Verify Code Screen',
        fields: {
          background_image: { type: 'image_url', label: 'Background Image', placeholder: '/images/signup-bg.jpg' },
          title: { type: 'text', label: 'Default Title', placeholder: 'Verify your authentication code' },
          reset_title: { type: 'text', label: 'Reset Password Title', placeholder: 'Reset your password' },
          email_description: { type: 'text', label: 'Email Verification Description', placeholder: 'Enter the 6-digit code sent to your email' },
          phone_description: { type: 'text', label: 'Phone Verification Description', placeholder: 'Enter the 6-digit code sent to your phone number' },
          reset_description: { type: 'text', label: 'Password Reset Description', placeholder: 'Enter the 6-digit code sent to your email to reset your password' },
          code_placeholder: { type: 'text', label: 'Code Placeholder', placeholder: 'Enter Code' },
          resend_text: { type: 'text', label: 'Resend Link Text', placeholder: 'Resend code' },
          submit_text: { type: 'text', label: 'Submit Button Text', placeholder: 'Verify' },
          terms_text: { type: 'rich_text', label: 'Terms Text', placeholder: 'By signing up, you agree to the Terms of Service and have reviewed the Privacy Policy. Manage privacy settings' },
        },
      },
    },
  },
  'services-by-city': {
    label: 'Services by City',
    slug: '/services-by-city',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          background_image: { type: 'image_url', label: 'Background Image', placeholder: '/images/hero/heroimage2.jpeg' },
          title: { type: 'text', label: 'Title', placeholder: 'Services by City' },
          subtitle: { type: 'text', label: 'Subtitle', placeholder: 'Find trusted 100 Handy Pros in your area' },
        },
      },
      areas: {
        label: 'Area Listings',
        fields: {
          london_title: { type: 'text', label: 'London Areas Title', placeholder: 'Find us in these cities' },
          uk_title: { type: 'text', label: 'UK Cities Title', placeholder: 'UK Cities' },
        },
      },
      how_it_works: {
        label: 'How It Works',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'How it works' },
          step_1: { type: 'text', label: 'Step 1', placeholder: 'Choose a 100 Handy Pro by price, skills, and reviews.' },
          step_2: { type: 'text', label: 'Step 2', placeholder: 'Schedule your 100 Handy Pro as early as today.' },
          step_3: { type: 'text', label: 'Step 3', placeholder: 'Chat, pay, tip, and review all in one place.' },
        },
      },
    },
  },
  'all-services': {
    label: 'All Services',
    slug: '/all-services',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          background_image: { type: 'image_url', label: 'Background Image', placeholder: '/images/services/hero.jpeg' },
          title: { type: 'rich_text', label: 'Title', placeholder: 'Find the Best Home Services Pros Nearby' },
          subtitle: { type: 'text', label: 'Subtitle', placeholder: 'Hire a trusted 100 Handy Pro today.' },
        },
      },
      services: {
        label: 'Service Links',
        fields: {
          item_1_name: { type: 'text', label: 'Service 1 Name', placeholder: 'Appliance Repair Near Me' },
          item_1_link: { type: 'text', label: 'Service 1 Link', placeholder: '/services/home-repairs/home-repairs' },
          item_2_name: { type: 'text', label: 'Service 2 Name', placeholder: 'Blind Repairs Near Me' },
          item_2_link: { type: 'text', label: 'Service 2 Link', placeholder: '/services/home-repairs/home-repairs' },
          item_3_name: { type: 'text', label: 'Service 3 Name', placeholder: 'Cabinet Installation Help Near Me' },
          item_3_link: { type: 'text', label: 'Service 3 Link', placeholder: '/services/furniture-assembly/furniture-assembly' },
          item_4_name: { type: 'text', label: 'Service 4 Name', placeholder: 'Carpet Cleaning Near Me' },
          item_4_link: { type: 'text', label: 'Service 4 Link', placeholder: '/services/cleaning/sparkle-clean' },
          item_5_name: { type: 'text', label: 'Service 5 Name', placeholder: 'Ceiling Fan Installation Help Near Me' },
          item_5_link: { type: 'text', label: 'Service 5 Link', placeholder: '/services/electrical/electricians' },
          item_6_name: { type: 'text', label: 'Service 6 Name', placeholder: 'Drywall Repair & Patching Near Me' },
          item_6_link: { type: 'text', label: 'Service 6 Link', placeholder: '/services/home-repairs/home-repairs' },
          item_7_name: { type: 'text', label: 'Service 7 Name', placeholder: 'Furniture Assembly Near Me' },
          item_7_link: { type: 'text', label: 'Service 7 Link', placeholder: '/services/furniture-assembly/furniture-assembly' },
          item_8_name: { type: 'text', label: 'Service 8 Name', placeholder: 'Furniture Removal Help Near Me' },
          item_8_link: { type: 'text', label: 'Service 8 Link', placeholder: '/services/packing-moving/moving' },
          item_9_name: { type: 'text', label: 'Service 9 Name', placeholder: 'Gutter Cleaning Near Me' },
          item_9_link: { type: 'text', label: 'Service 9 Link', placeholder: '/services/outdoor/great-outdoors' },
          item_10_name: { type: 'text', label: 'Service 10 Name', placeholder: 'Handyman Near Me' },
          item_10_link: { type: 'text', label: 'Service 10 Link', placeholder: '/services/handyman/general' },
          item_11_name: { type: 'text', label: 'Service 11 Name', placeholder: 'Hedge Trimming Near Me' },
          item_11_link: { type: 'text', label: 'Service 11 Link', placeholder: '/services/outdoor/great-outdoors' },
          item_12_name: { type: 'text', label: 'Service 12 Name', placeholder: 'Moving Help Near Me' },
          item_12_link: { type: 'text', label: 'Service 12 Link', placeholder: '/services/packing-moving/moving' },
          item_13_name: { type: 'text', label: 'Service 13 Name', placeholder: 'House Cleaning Near Me' },
          item_13_link: { type: 'text', label: 'Service 13 Link', placeholder: '/services/cleaning/sparkle-clean' },
          item_14_name: { type: 'text', label: 'Service 14 Name', placeholder: 'Air Conditioner Installation Near Me' },
          item_14_link: { type: 'text', label: 'Service 14 Link', placeholder: '/services/electrical/electricians' },
          item_15_name: { type: 'text', label: 'Service 15 Name', placeholder: 'Junk Removal Near Me' },
          item_15_link: { type: 'text', label: 'Service 15 Link', placeholder: '/services/packing-moving/moving' },
          item_16_name: { type: 'text', label: 'Service 16 Name', placeholder: 'Lawn Mowing & Trimming Near Me' },
          item_16_link: { type: 'text', label: 'Service 16 Link', placeholder: '/services/outdoor/great-outdoors' },
          item_17_name: { type: 'text', label: 'Service 17 Name', placeholder: 'Painting Help Near Me' },
          item_17_link: { type: 'text', label: 'Service 17 Link', placeholder: '/services/home-repairs/home-repairs' },
          item_18_name: { type: 'text', label: 'Service 18 Name', placeholder: 'Pressure Washing Near Me' },
          item_18_link: { type: 'text', label: 'Service 18 Link', placeholder: '/services/outdoor/great-outdoors' },
          item_19_name: { type: 'text', label: 'Service 19 Name', placeholder: 'TV Mounting Near Me' },
          item_19_link: { type: 'text', label: 'Service 19 Link', placeholder: '/services/tv-wall-mounting/tv-mounting' },
          item_20_name: { type: 'text', label: 'Service 20 Name', placeholder: 'Wallpapering Near Me' },
          item_20_link: { type: 'text', label: 'Service 20 Link', placeholder: '/services/home-repairs/home-repairs' },
        },
      },
    },
  },
  referral: {
    label: 'Referral',
    slug: '/referral',
    sections: {
      hero: {
        label: 'Referral Screen',
        fields: {
          title: { type: 'text', label: 'Title', placeholder: 'Help Your Friends, Get £10' },
          description: { type: 'rich_text', label: 'Description', placeholder: 'Refer a friend to 100Handy. They get £10 off their first task. You get £10 off when they complete it.' },
          email_placeholder: { type: 'text', label: 'Email Placeholder', placeholder: 'Enter email address' },
          send_invite_text: { type: 'text', label: 'Send Invite Button Text', placeholder: 'Send Invite' },
          email_help_text: { type: 'text', label: 'Email Help Text', placeholder: 'Separate email recipients with commas (eg: friend1@gmail.com, friend2@gmail.com)' },
          copy_button_text: { type: 'text', label: 'Copy Button Text', placeholder: 'Copy link' },
          copied_button_text: { type: 'text', label: 'Copied Button Text', placeholder: 'Copied!' },
        },
      },
    },
  },
  'locations-city': {
    label: 'Location City Template',
    slug: '/locations/[city]',
    sections: {
      hero: {
        label: 'City Landing Template',
        fields: {
          title: { type: 'text', label: 'Title Template', placeholder: 'Services in {city}' },
          description: { type: 'rich_text', label: 'Description Template', placeholder: 'Browse {tasker_count}+ trusted 100 Handy Pros ready to help with your home projects in {city}.' },
          reviews_template: { type: 'text', label: 'Reviews Template', placeholder: '{review_count} Reviews' },
          services_title: { type: 'text', label: 'Services Section Title', placeholder: 'Popular Services in {city}' },
          card_description: { type: 'text', label: 'Service Card Description Template', placeholder: 'Find {service} help in {city}' },
        },
      },
    },
  },
  'locations-city-service': {
    label: 'Location City Service Template',
    slug: '/locations/[city]/[service]',
    sections: {
      hero: {
        label: 'City Service Template',
        fields: {
          title: { type: 'rich_text', label: 'Title Template', placeholder: '{service} Services in<br />{city}' },
          reviews_template: { type: 'text', label: 'Reviews Template', placeholder: '{review_count} Reviews' },
          bullet_1: { type: 'text', label: 'Bullet 1 Template', placeholder: 'Browse {tasker_count}+ 100 Handy Pros with a variety of skills.' },
          bullet_2: { type: 'text', label: 'Bullet 2', placeholder: 'All 100 Handy Pros bring their own tools and equipment.' },
          cta_text: { type: 'text', label: 'CTA Text', placeholder: 'Book Now' },
          featured_title: { type: 'text', label: 'Featured Title Template', placeholder: '{tasker_count} featured {service} 100 Handy Pros in {city}' },
        },
      },
    },
  },
  'about-us': {
    label: 'About Us',
    slug: '/about-us',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'text', label: 'Page Title', placeholder: 'About Us' },
          image: { type: 'image_url', label: 'Hero Image', placeholder: '/images/about/about-us.png' },
        },
      },
      content: {
        label: 'Main Content',
        fields: {
          heading: { type: 'text', label: 'Heading', placeholder: 'Making life simpler, one neighborhood at a time.' },
          paragraph_1: { type: 'rich_text', label: 'Paragraph 1', placeholder: 'We believe that the best help is local. At the heart of 100 Handy is a simple but powerful idea: connecting people who need time with people who have skills.' },
          paragraph_2: { type: 'rich_text', label: 'Paragraph 2', placeholder: "We know that for every overwhelming to-do list, there is a capable professional nearby ready to get to work. Whether it's hanging a crib for a new arrival, fixing a leaky faucet before the in-laws visit, or simply giving you back your Saturday afternoon, we are the bridge that makes it happen. We aren't just completing tasks; we are building stronger communities where neighbors help neighbors thrive." },
        },
      },
      leadership: {
        label: 'Leadership Team',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Leadership Team' },
          member_1_name: { type: 'text', label: 'Member 1 Name', placeholder: 'Berkay Dasha' },
          member_1_role: { type: 'text', label: 'Member 1 Role', placeholder: 'Chief Executive Officer' },
          member_1_image: { type: 'image_url', label: 'Member 1 Photo', placeholder: '/team/1.jpg' },
          member_2_name: { type: 'text', label: 'Member 2 Name', placeholder: 'Amara Osei' },
          member_2_role: { type: 'text', label: 'Member 2 Role', placeholder: 'Chief Technology Officer' },
          member_2_image: { type: 'image_url', label: 'Member 2 Photo', placeholder: '/team/2.jpg' },
          member_3_name: { type: 'text', label: 'Member 3 Name', placeholder: 'Liam Chen' },
          member_3_role: { type: 'text', label: 'Member 3 Role', placeholder: 'Chief Operating Officer' },
          member_3_image: { type: 'image_url', label: 'Member 3 Photo', placeholder: '/team/3.jpg' },
          member_4_name: { type: 'text', label: 'Member 4 Name', placeholder: 'Sofia Petrov' },
          member_4_role: { type: 'text', label: 'Member 4 Role', placeholder: 'Chief Marketing Officer' },
          member_4_image: { type: 'image_url', label: 'Member 4 Photo', placeholder: '/team/4.jpg' },
          member_5_name: { type: 'text', label: 'Member 5 Name', placeholder: 'Daniel Mora' },
          member_5_role: { type: 'text', label: 'Member 5 Role', placeholder: 'Chief Financial Officer' },
          member_5_image: { type: 'image_url', label: 'Member 5 Photo', placeholder: '/team/5.jpg' },
          member_6_name: { type: 'text', label: 'Member 6 Name', placeholder: 'Priya Sharma' },
          member_6_role: { type: 'text', label: 'Member 6 Role', placeholder: 'VP of Engineering' },
          member_6_image: { type: 'image_url', label: 'Member 6 Photo', placeholder: '/team/6.jpg' },
          member_7_name: { type: 'text', label: 'Member 7 Name', placeholder: 'Marcus Webb' },
          member_7_role: { type: 'text', label: 'Member 7 Role', placeholder: 'VP of Product' },
          member_7_image: { type: 'image_url', label: 'Member 7 Photo', placeholder: '/team/7.jpg' },
          member_8_name: { type: 'text', label: 'Member 8 Name', placeholder: 'Elena Rossi' },
          member_8_role: { type: 'text', label: 'Member 8 Role', placeholder: 'Head of Design' },
          member_8_image: { type: 'image_url', label: 'Member 8 Photo', placeholder: '/team/8.jpg' },
          member_9_name: { type: 'text', label: 'Member 9 Name', placeholder: 'James Okoro' },
          member_9_role: { type: 'text', label: 'Member 9 Role', placeholder: 'Head of Operations' },
          member_9_image: { type: 'image_url', label: 'Member 9 Photo', placeholder: '/team/9.jpg' },
        },
      },
    },
  },
  'for-good': {
    label: '100 Handy Cares',
    slug: '/for-good',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          badge: { type: 'text', label: 'Badge Text', placeholder: '100 Handy Cares' },
          title: { type: 'text', label: 'Page Title', placeholder: '100 Handy Cares' },
          paragraph: { type: 'rich_text', label: 'Main Paragraph', placeholder: 'Content coming soon.' },
          supporting_text: { type: 'rich_text', label: 'Supporting Text', placeholder: "We're working on sharing our community initiatives and giving-back programs. Check back soon to learn how 100 Handy is making a positive impact in neighborhoods across the country." },
        },
      },
    },
  },
  careers: {
    label: 'Careers',
    slug: '/careers',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'text', label: 'Page Title', placeholder: "Let's Build the Future of Local Help." },
          paragraph: { type: 'rich_text', label: 'Hero Paragraph', placeholder: "Join the team that is redefining how the world gets work done. We're connecting neighbors, empowering professionals, and simplifying lives - one click at a time." },
        },
      },
      mission: {
        label: 'Mission Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Empowering neighborhoods, one job at a time.' },
          paragraph_1: { type: 'rich_text', label: 'Paragraph 1', placeholder: 'In 2025, we said: Everyone should have the chance to have their services found more easily, without breaking their head over how to promote themselves. At 100 Handy, we aren\'t just fixing squeaky doors; we are supporting those who have been overlooked.' },
          paragraph_2: { type: 'rich_text', label: 'Paragraph 2', placeholder: 'We are on a mission to bring trust and transparency back to home services. By connecting millions of customers with skilled Pros, we are creating flexible income opportunities for thousands and giving people back their most valuable resource: time.' },
          paragraph_3: { type: 'rich_text', label: 'Paragraph 3', placeholder: 'Imagine a world where the friction of daily life - from mounting a TV to moving house - is removed instantly. That is the magic we build every day. Whether you code, design, market, or support, your work here has a tangible impact on real lives.' },
          paragraph_4: { type: 'rich_text', label: 'Closing Statement', placeholder: 'Join us at 100 Handy, where your ideas travel from the whiteboard to the real world, fast.' },
        },
      },
      values: {
        label: 'Values Carousel',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'We live by our values.' },
          subtitle: { type: 'rich_text', label: 'Section Subtitle', placeholder: 'Our culture is our operating system. It guides how we hire, how we build, and how we treat each other.' },
          item_1_title: { type: 'text', label: 'Value 1 Title', placeholder: 'Dare to Innovate' },
          item_1_description: { type: 'rich_text', label: 'Value 1 Description', placeholder: `We don't settle for "good enough." We approach every problem with fresh eyes and fearless curiosity. We aren't afraid to break things if it means building something better. Failure is just data gathering for the next big win.` },
          item_2_title: { type: 'text', label: 'Value 2 Title', placeholder: 'Win as One Team' },
          item_2_description: { type: 'rich_text', label: 'Value 2 Description', placeholder: 'We check our egos at the door. We work passionately under one roof (physical or digital), elevating our peers and inspiring trust. We are kind, candid, and assume good intent. When one of us wins, we all win.' },
          item_3_title: { type: 'text', label: 'Value 3 Title', placeholder: 'Own the Outcome' },
          item_3_description: { type: 'rich_text', label: 'Value 3 Description', placeholder: "We are all responsible for the success of 100 Handy. We don't pass the buck. We take smart risks, make decisions faster, and deliver results that make a lasting impact on our business and the planet." },
          item_4_title: { type: 'text', label: 'Value 4 Title', placeholder: 'Simplicity is Speed' },
          item_4_description: { type: 'rich_text', label: 'Value 4 Description', placeholder: 'Complex problems require simple solutions. We value momentum over perfection. We strive to strip away the noise and focus on what truly matters to get our mission to more people, faster.' },
          item_5_title: { type: 'text', label: 'Value 5 Title', placeholder: 'Champion the User' },
          item_5_description: { type: 'rich_text', label: 'Value 5 Description', placeholder: 'Our community is the heartbeat of our company. We build solutions that start with the customer\'s needs. We are a force for good and we make every decision with Clients and Pros in mind.' },
          cta_text: { type: 'text', label: 'CTA Button Text', placeholder: 'See Open Roles' },
        },
      },
      culture: {
        label: 'Culture Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Flexible Work, Stronger Connections.' },
          paragraph_1: { type: 'rich_text', label: 'Paragraph 1', placeholder: 'At 100 Handy, we believe work should fit into your life, not the other way around. That\'s why we\'ve adopted a "Remote-First, Office-Optional" policy. We trust our employees to work where they are most productive, while also creating meaningful moments to come together.' },
          paragraph_2: { type: 'rich_text', label: 'Paragraph 2', placeholder: 'Whether you are logging in from a home office in London or a coworking space, we use technology to foster connection, make decisions in real-time, and celebrate wins. It\'s the best of both worlds: the freedom of remote work with the fun of in-person retreats.' },
        },
      },
      roles: {
        label: 'Open Roles Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Open Roles' },
          paragraph: { type: 'rich_text', label: 'Description', placeholder: "We're always looking for talented people to join our team. Check back soon for open positions, or reach out to us directly." },
        },
      },
    },
  },
  'elite-taskers': {
    label: '100 Handy Star',
    slug: '/elite-taskers',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          badge: { type: 'text', label: 'Badge Text', placeholder: '100 Handy Star' },
          title: { type: 'text', label: 'Page Title', placeholder: 'The 100 Handy Star' },
          subtitle: { type: 'text', label: 'Subtitle', placeholder: 'Our top-rated 100 Handy Pros, ready when you are.' },
          description: { type: 'rich_text', label: 'Description', placeholder: 'The 100 Handy Star badge highlights 100 Handy Pros who consistently deliver outstanding workmanship, clear communication, and a smooth customer experience - task after task.' },
        },
      },
      benefits: {
        label: 'Benefits Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Why Customers Choose a 100 Handy Star' },
          benefit_1_title: { type: 'text', label: 'Benefit 1 Title', placeholder: 'Consistently high ratings' },
          benefit_1_description: { type: 'rich_text', label: 'Benefit 1 Description', placeholder: 'Customers regularly leave glowing reviews for 100 Handy Stars - because they go above and beyond to ensure the job is completed to the highest standard, showcasing their expertise.' },
          benefit_2_title: { type: 'text', label: 'Benefit 2 Title', placeholder: 'Reliable and responsive' },
          benefit_2_description: { type: 'rich_text', label: 'Benefit 2 Description', placeholder: "On-time arrivals, quick replies, and updates you can count on - so you're never left guessing." },
          benefit_3_title: { type: 'text', label: 'Benefit 3 Title', placeholder: 'Experienced and active' },
          benefit_3_description: { type: 'rich_text', label: 'Benefit 3 Description', placeholder: '100 Handy Stars complete a high number of tasks and bring real, hands-on experience to every booking.' },
        },
      },
      trust: {
        label: 'Trust Statement',
        fields: {
          statement: { type: 'rich_text', label: 'Trust Statement', placeholder: "They're also trusted and dependable, with a strong record of following 100 Handy's Marketplace Guidelines." },
        },
      },
      hire: {
        label: 'How to Hire Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'How Do I Hire a 100 Handy Star?' },
          description: { type: 'rich_text', label: 'Description', placeholder: "It's simple. When you search for a service, look for the Star badge on a 100 Handy Pro's profile or in your search results. Then compare reviews, rates, and availability to book the right match." },
          cta: { type: 'text', label: 'CTA Button Text', placeholder: 'Find your Star today' },
          mockup_brand: { type: 'text', label: 'Mockup Brand Label', placeholder: '100 HANDY' },
          mockup_rating: { type: 'text', label: 'Mockup Rating Label', placeholder: '5.0' },
        },
      },
    },
  },
  '100-handy-star': {
    label: '100 Handy Star',
    slug: '/100-handy-star',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          badge: { type: 'text', label: 'Badge Text', placeholder: '100 Handy Star' },
          title: { type: 'text', label: 'Page Title', placeholder: 'The 100 Handy Star' },
          subtitle: { type: 'text', label: 'Subtitle', placeholder: 'Our top-rated 100 Handy Pros, ready when you are.' },
          description: { type: 'rich_text', label: 'Description', placeholder: 'The 100 Handy Star badge highlights 100 Handy Pros who consistently deliver outstanding workmanship, clear communication, and a smooth customer experience - task after task.' },
        },
      },
      benefits: {
        label: 'Benefits Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Why Customers Choose a 100 Handy Star' },
          benefit_1_title: { type: 'text', label: 'Benefit 1 Title', placeholder: 'Consistently high ratings' },
          benefit_1_description: { type: 'rich_text', label: 'Benefit 1 Description', placeholder: 'Customers regularly leave glowing reviews for 100 Handy Stars - because they go above and beyond to ensure the job is completed to the highest standard, showcasing their expertise.' },
          benefit_2_title: { type: 'text', label: 'Benefit 2 Title', placeholder: 'Reliable and responsive' },
          benefit_2_description: { type: 'rich_text', label: 'Benefit 2 Description', placeholder: "On-time arrivals, quick replies, and updates you can count on - so you're never left guessing." },
          benefit_3_title: { type: 'text', label: 'Benefit 3 Title', placeholder: 'Experienced and active' },
          benefit_3_description: { type: 'rich_text', label: 'Benefit 3 Description', placeholder: '100 Handy Stars complete a high number of tasks and bring real, hands-on experience to every booking.' },
        },
      },
      trust: {
        label: 'Trust Statement',
        fields: {
          statement: { type: 'rich_text', label: 'Trust Statement', placeholder: "They're also trusted and dependable, with a strong record of following 100 Handy's Marketplace Guidelines." },
        },
      },
      hire: {
        label: 'How to Hire Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'How Do I Hire a 100 Handy Star?' },
          description: { type: 'rich_text', label: 'Description', placeholder: "It's simple. When you search for a service, look for the Star badge on a 100 Handy Pro's profile or in your search results. Then compare reviews, rates, and availability to book the right match." },
          cta: { type: 'text', label: 'CTA Button Text', placeholder: 'Find your Star today' },
        },
      },
    },
  },
  'cookie-settings': {
    label: 'Cookie Settings',
    slug: '/cookie-settings',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'text', label: 'Page Title', placeholder: 'Cookie Settings' },
        },
      },
      content: {
        label: 'Main Content',
        fields: {
          paragraph_1: { type: 'rich_text', label: 'Paragraph 1', placeholder: "Content coming soon. We're preparing our cookie management interface." },
          paragraph_2: { type: 'rich_text', label: 'Paragraph 2', placeholder: 'If you have any questions about our cookie policy in the meantime, please contact us at privacy@100handy.com' },
        },
      },
    },
  },
  help: {
    label: 'Help Centre',
    slug: '/help',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'text', label: 'Page Title', placeholder: 'How can we help?' },
          subtitle: { type: 'rich_text', label: 'Subtitle', placeholder: 'Are you a 100 Handy Pro? Sign in to view additional resources.' },
        },
      },
      categories: {
        label: 'Category Labels',
        fields: {
          client_title: { type: 'text', label: 'Client Label', placeholder: 'Client' },
          pro_title: { type: 'text', label: '100 Handy Pro Label', placeholder: '100 Handy Pro' },
          registration_title: { type: 'text', label: 'Registration Label', placeholder: 'Registration' },
          account_title: { type: 'text', label: 'Account Label', placeholder: 'Account' },
          policy_title: { type: 'text', label: 'Policy Label', placeholder: 'Policy Center' },
        },
      },
      ctas: {
        label: 'CTA Cards',
        fields: {
          contact_title: { type: 'text', label: 'Contact CTA Title', placeholder: "Can't find what you need? →" },
          contact_description: { type: 'rich_text', label: 'Contact CTA Description', placeholder: "Contact us and we'll get back to you as soon as we can." },
          services_title: { type: 'text', label: 'Services CTA Title', placeholder: 'Ready to book a task? →' },
          services_description: { type: 'rich_text', label: 'Services CTA Description', placeholder: 'Head over to our website to see our available categories!' },
        },
      },
    },
  },
  legal: {
    label: 'Legal',
    slug: '/legal',
    sections: {
      content: {
        label: 'Page Content',
        fields: {
          title: { type: 'text', label: 'Page Title', placeholder: 'Legal' },
          paragraph: { type: 'rich_text', label: 'Main Text', placeholder: "Content coming soon. We're preparing our legal documentation." },
          contact_text: { type: 'rich_text', label: 'Contact Text', placeholder: 'If you have any legal inquiries in the meantime, please contact us at' },
        },
      },
    },
  },
  terms: {
    label: 'Terms & Privacy',
    slug: '/terms',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'text', label: 'Page Title', placeholder: 'Terms & Privacy' },
          last_updated: { type: 'text', label: 'Last Updated', placeholder: 'Last updated: March 2026' },
        },
      },
      terms_of_service: {
        label: 'Terms of Service',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Terms of Service' },
          content: { type: 'rich_text', label: 'Content', placeholder: 'The Terms of Service explain the legal agreement between 100 Handy and its users.\n\nThis includes:\n\n• How the 100 Handy platform can be used\n• How service agreements are formed between Clients and 100 Handy Pros\n• Rules for booking services\n• Payment and fee policies\n• Cancellation and refund conditions\n• Responsibilities of both Clients and Pros\n• Platform rights and limitations\n\nAll users must agree to the Terms of Service before using the platform.' },
        },
      },
      privacy_policy: {
        label: 'Privacy Policy',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Privacy Policy' },
          content: { type: 'rich_text', label: 'Content', placeholder: 'The Privacy Policy explains how 100 Handy collects, uses, stores, and protects personal information.\n\nThis includes:\n\n• What personal data is collected\n• How your information is used\n• How data is stored securely\n• When information may be shared\n• Your rights regarding personal data\n• How to request updates or deletion of your data\n\n100 Handy is committed to protecting user privacy and handling information responsibly.' },
        },
      },
      service_protection: {
        label: 'Service Protection',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Service Protection Terms & Conditions' },
          content: { type: 'rich_text', label: 'Content', placeholder: '100 Handy may offer service protection measures designed to support Clients and Pros when issues occur.\n\nThis section explains:\n\n• What types of issues may be covered\n• How to submit a claim\n• How claims are reviewed\n• What users must agree to before compensation is issued\n• Conditions that may limit coverage\n\nProtection policies help ensure fairness when unexpected issues arise.' },
        },
      },
      trust_and_safety: {
        label: 'Trust & Safety',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Trust & Safety' },
          content: { type: 'rich_text', label: 'Content', placeholder: 'Keeping your account secure\n\nProtecting your account helps prevent unauthorised access.\n\nWe recommend:\n\n• Using strong passwords\n• Keeping login details private\n• Updating passwords regularly\n• Logging out on shared devices\n• Reporting suspicious activity immediately\n\nIf unusual activity is detected, security checks may be applied to protect your account.\n\nUser safety guidance\n\nSafety is a priority for everyone using 100 Handy.\n\nRecommended safety practices include:\n\n• Keeping communication within the platform\n• Reporting unsafe behaviour immediately\n• Avoiding sharing sensitive personal information\n\nFollowing safety guidance helps create a trusted working environment.\n\nBackground checks and verification\n\n100 Handy uses verification processes to support trust between users.\n\nThese may include:\n\n• Identity verification\n• Profile checks\n• Background screening (where required)\n• Service-related credential verification\n\nVerification helps maintain platform quality and safety.' },
        },
      },
      platform_rules: {
        label: 'Platform Rules',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Platform Rules' },
          content: { type: 'rich_text', label: 'Content', placeholder: 'Acceptable use and platform rules\n\nAll users must follow platform rules when using 100 Handy.\n\nAcceptable use includes:\n\n• Providing accurate information\n• Communicating respectfully\n• Using the platform only for legitimate services\n• Following booking and payment procedures\n• Maintaining professional behaviour\n\nProhibited activities include:\n\n• Fraudulent behaviour\n• Misuse of accounts\n• Harassment or threatening behaviour\n• Sexual misconduct, harassment, or inappropriate behaviour of any kind\n• Discrimination based on gender, race, religion, nationality, disability, sexual orientation, or any protected characteristic\n• Attempting to bypass platform processes\n• Providing false information\n\nViolations of these rules may lead to account action.\n\nClient and Pro responsibilities\n\nBoth Clients and 100 Handy Pros have responsibilities when using the platform.\n\nClient responsibilities include:\n\n• Providing clear job descriptions\n• Giving accurate location details\n• Making payments as agreed\n• Respecting professional conduct\n\n100 Handy Pro responsibilities include:\n\n• Delivering services professionally\n• Communicating clearly\n• Arriving on time\n• Completing work as agreed\n• Following safety and service guidelines\n\nShared responsibility helps maintain quality across the platform.\n\nAccount action and enforcement\n\nIf platform rules are broken, action may be taken to protect the platform and its users.\n\nPossible actions include:\n\n• Account warnings\n• Temporary suspension\n• Service restrictions\n• Permanent account termination\n\nEnforcement decisions are made based on the severity of the issue and user history.' },
        },
      },
      country_specific: {
        label: 'Country-Specific Policies',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Country-Specific Policies' },
          content: { type: 'rich_text', label: 'Content', placeholder: 'UK-specific legal and tax guidance\n\n100 Handy Pros operating in the UK may have additional responsibilities.\n\nThese may include:\n\n• Registering as self-employed or operating as a business\n• Managing tax responsibilities\n• Keeping records of earnings\n• Following local employment and service laws\n\n100 Handy Pros are responsible for ensuring compliance with local tax and legal obligations.\n\nLocal service terms\n\nSome policies may vary depending on:\n\n• The region where services are delivered\n• The type of service being offered\n• Local safety or licensing requirements\n\nUsers will be informed if additional conditions apply to specific services.\n\nRegulatory and compliance information\n\n100 Handy operates in accordance with applicable laws and regulations.\n\nThis includes:\n\n• Consumer protection requirements\n• Data protection regulations\n• Platform safety standards\n• Regional service regulations\n\nCompliance ensures the platform operates responsibly and legally.' },
        },
      },
      contact_section: {
        label: 'Contact Us',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Contact Us' },
          content: { type: 'rich_text', label: 'Content', placeholder: 'If you have questions about policies or need assistance with safety or compliance matters, you can contact our support team directly.\n\nFor policy-related enquiries, please email:\n\nhelp@100handy.com\n\nOur team will review your message and respond with the appropriate guidance.' },
        },
      },
    },
  },
  blog: {
    label: 'Blog',
    slug: '/blog',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'text', label: 'Page Title', placeholder: 'Blog' },
          subtitle: { type: 'text', label: 'Subtitle', placeholder: 'Tips, guides, and stories from the 100 Handy community' },
          image: { type: 'image_url', label: 'Hero Background Image', placeholder: '/images/hero/heroimage2.jpeg' },
        },
      },
    },
  },
  contact: {
    label: 'Contact Us',
    slug: '/contact',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          breadcrumb: { type: 'text', label: 'Breadcrumb Text', placeholder: '100Handy Support / Submit a request' },
          title: { type: 'text', label: 'Page Title', placeholder: 'Contact Us' },
        },
      },
      cards: {
        label: 'Contact Cards',
        fields: {
          card_1_title: { type: 'text', label: 'Card 1 Title', placeholder: 'Message us' },
          card_1_text: { type: 'text', label: 'Card 1 Text', placeholder: 'Click here to reach out!' },
          card_2_title: { type: 'text', label: 'Card 2 Title', placeholder: 'Send us an email' },
          card_2_text: { type: 'text', label: 'Card 2 Text', placeholder: 'Available every day' },
          card_3_title: { type: 'text', label: 'Card 3 Title', placeholder: 'Give us a call' },
          card_3_text: { type: 'text', label: 'Card 3 Text', placeholder: 'Toll free for US and Canada' },
        },
      },
      form: {
        label: 'Email Form',
        fields: {
          title: { type: 'text', label: 'Form Title', placeholder: 'Send us an email' },
          subtitle: { type: 'text', label: 'Form Subtitle', placeholder: 'Please provide detailed information below and our agents will reply via email as soon as possible.' },
        },
      },
    },
  },
  'for-business': {
    label: 'For Business',
    slug: '/for-business',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'text', label: 'Page Title', placeholder: 'Boost sales — without adding operational load' },
          subtitle: { type: 'rich_text', label: 'Subtitle', placeholder: '100 Handy partners with retailers and service-led brands to provide trusted assembly, mounting, and installation.' },
          image: { type: 'image_url', label: 'Hero Image', placeholder: '/images/hero/partnerheroimage.png' },
        },
      },
      benefits: {
        label: 'Benefits Section',
        fields: {
          item_1_title: { type: 'text', label: 'Benefit 1 Title', placeholder: 'Build Customer Loyalty' },
          item_1_description: { type: 'rich_text', label: 'Benefit 1 Description', placeholder: 'Offer a convenient, reliable solution for assembly and installation — so your customers feel supported from delivery to done.' },
          item_2_title: { type: 'text', label: 'Benefit 2 Title', placeholder: 'Increase Sales & Reduce Returns' },
          item_2_description: { type: 'rich_text', label: 'Benefit 2 Description', placeholder: "When customers know help is available, they're more likely to buy — and less likely to return items because setup felt overwhelming." },
          item_3_title: { type: 'text', label: 'Benefit 3 Title', placeholder: 'Seamless Integration' },
          item_3_description: { type: 'rich_text', label: 'Benefit 3 Description', placeholder: 'We can support scheduling and service workflows to make booking and payment feel effortless for your customers and your team.' },
        },
      },
      form: {
        label: 'Partnership Form Copy',
        fields: {
          title: { type: 'text', label: 'Form Title', placeholder: 'Want to Learn More About Partnering With 100 Handy?' },
          intro: { type: 'rich_text', label: 'Form Intro', placeholder: "Tell us a bit about your business and what you're looking to enable. We'll follow up with relevant details, example workflows, and a case study — then explore the best partnership model for you." },
          success_title: { type: 'text', label: 'Success Title', placeholder: 'Thank You for Your Interest!' },
          success_message: { type: 'rich_text', label: 'Success Message', placeholder: "We've received your inquiry and will be in touch within 2 business days to discuss partnership opportunities." },
          footer_link_text: { type: 'text', label: 'Footer Link Text', placeholder: 'Looking to sign up as a 100 Handy Pro?' },
          footer_link_cta: { type: 'text', label: 'Footer Link CTA', placeholder: 'Submit your application here' },
        },
      },
    },
  },
  'become-100-handy-pro': {
    label: 'Become 100 Handy Pro',
    slug: '/become-100-handy-pro',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'text', label: 'Page Title', placeholder: 'Earn Money Your Way' },
          subtitle: { type: 'rich_text', label: 'Subtitle', placeholder: 'Turn your skills into a flexible income. Choose the work you like, set your availability, and get paid for jobs completed.' },
          categories_list: { type: 'rich_text', label: 'Category Chips', placeholder: 'Cleaning Jobs\nElectrical Help Jobs\nFurniture Assembly Jobs\nIKEA Assembly Jobs\nIndoor Painting Jobs\nLight Carpentry Jobs\nMinor Home Repairs Jobs\nPlumbing Help Jobs\nTrash & Furniture Removal Jobs\nGardening Jobs' },
        },
      },
      benefits: {
        label: 'Benefits Section',
        fields: {
          intro: { type: 'rich_text', label: 'Section Intro', placeholder: 'Find local jobs that fit your skills and schedule. With 100 Handy, you have the freedom and support to be your own boss.' },
          item_1_title: { type: 'text', label: 'Benefit 1 Title', placeholder: 'Be your own boss' },
          item_1_description: { type: 'rich_text', label: 'Benefit 1 Description', placeholder: 'Work how, when, and where you want. Offer services in 50+ categories and set a flexible schedule and work area. You are in control of your time.' },
          item_2_title: { type: 'text', label: 'Benefit 2 Title', placeholder: 'Set your own rates' },
          item_2_description: { type: 'rich_text', label: 'Benefit 2 Description', placeholder: 'You know what your skills are worth. You set your hourly rate, and you keep 100% of your tips. We handle the invoicing so you get paid directly and securely.' },
          item_3_title: { type: 'text', label: 'Benefit 3 Title', placeholder: 'Grow your business' },
          item_3_description: { type: 'rich_text', label: 'Benefit 3 Description', placeholder: "We connect you with clients in your area and give you the tools to market yourself. Say goodbye to advertising costs - focus on what you do best, and we'll bring the work to you." },
        },
      },
      overview: {
        label: 'What is 100 Handy',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'What is 100 Handy?' },
          image: { type: 'image_url', label: 'Overview Image', placeholder: '/images/become-tasker/what-is-100handy.jpeg' },
          paragraph_1: { type: 'rich_text', label: 'Paragraph 1', placeholder: '100 Handy connects customers who need help with skilled local Pros - like you. From home repairs and mounting to cleaning and moving help, we make it simple for people to book services they can trust.' },
          paragraph_2: { type: 'rich_text', label: 'Paragraph 2', placeholder: 'You bring the skills. We help you get discovered, manage bookings, and get paid securely - so you can focus on doing great work.' },
        },
      },
      getting_started: {
        label: 'Getting Started',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Getting Started is Simple' },
          image: { type: 'image_url', label: 'Section Image', placeholder: '/images/become-tasker/what-is-100handy.jpeg' },
          step_1_title: { type: 'text', label: 'Step 1 Title', placeholder: 'Sign up' },
          step_1_description: { type: 'rich_text', label: 'Step 1 Description', placeholder: 'Create your account in minutes with your email or social login.' },
          step_2_title: { type: 'text', label: 'Step 2 Title', placeholder: 'Build your profile' },
          step_2_description: { type: 'rich_text', label: 'Step 2 Description', placeholder: 'Add your skills, experience, service areas, and a friendly intro. A strong profile helps you win more bookings.' },
          step_3_title: { type: 'text', label: 'Step 3 Title', placeholder: 'Verify your eligibility to task' },
          step_3_description: { type: 'rich_text', label: 'Step 3 Description', placeholder: 'Complete identity checks and any requirements needed for your location and categories.' },
          step_4_title: { type: 'text', label: 'Step 4 Title', placeholder: 'Set your schedule and work area' },
          step_4_description: { type: 'rich_text', label: 'Step 4 Description', placeholder: 'Choose your availability and where you want to work - near home, across the city, or both.' },
          step_5_title: { type: 'text', label: 'Step 5 Title', placeholder: 'Start getting jobs' },
          step_5_description: { type: 'rich_text', label: 'Step 5 Description', placeholder: 'Receive requests, accept the work that fits, show up prepared, and get paid when the job is done.' },
        },
      },
      faqs: {
        label: 'FAQs',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Frequently Asked Questions' },
          faq_1_question: { type: 'text', label: 'FAQ 1 Question', placeholder: 'What do I need to become a Handy?' },
          faq_1_answer: { type: 'rich_text', label: 'FAQ 1 Answer', placeholder: "You'll need relevant skills for your chosen categories, a completed profile, and to pass verification requirements for your location." },
          faq_2_question: { type: 'text', label: 'FAQ 2 Question', placeholder: 'How do I get paid?' },
          faq_2_answer: { type: 'rich_text', label: 'FAQ 2 Answer', placeholder: 'Payments are handled securely through the platform after the job is completed, so you do not need to chase invoices.' },
          faq_3_question: { type: 'text', label: 'FAQ 3 Question', placeholder: 'How long does it take to get approved?' },
          faq_3_answer: { type: 'rich_text', label: 'FAQ 3 Answer', placeholder: 'Timelines vary by location and verification steps, but many pros can complete setup quickly once documents are submitted.' },
          faq_4_question: { type: 'text', label: 'FAQ 4 Question', placeholder: 'Can I choose my own hours?' },
          faq_4_answer: { type: 'rich_text', label: 'FAQ 4 Answer', placeholder: 'Yes. Set your schedule, update it anytime, and only accept jobs that work for you.' },
          faq_5_question: { type: 'text', label: 'FAQ 5 Question', placeholder: 'Do I need my own tools?' },
          faq_5_answer: { type: 'rich_text', label: 'FAQ 5 Answer', placeholder: 'For most categories, yes. Customers book you for your expertise - having the right tools helps you complete work efficiently and earn better reviews.' },
          faq_6_question: { type: 'text', label: 'FAQ 6 Question', placeholder: 'How do I get more jobs?' },
          faq_6_answer: { type: 'rich_text', label: 'FAQ 6 Answer', placeholder: 'A great profile, fast responses, fair pricing, and strong reviews help you rank higher and get booked more often.' },
          cta_title: { type: 'text', label: 'Bottom CTA Title', placeholder: 'Ready to create an extra source of income?' },
        },
      },
    },
  },
  press: {
    label: 'Press',
    slug: '/press',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'text', label: 'Page Title', placeholder: 'Press' },
          image: { type: 'image_url', label: 'Hero Image', placeholder: '/images/press/pressheroimage.jpeg' },
        },
      },
      contact: {
        label: 'Get in Touch',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Get in Touch' },
          intro: { type: 'rich_text', label: 'Intro', placeholder: "The 100Handy team is available to connect for media inquiries and partnership opportunities. If you'd like to get in touch, please reach out to the appropriate contact below." },
          item_1_title: { type: 'text', label: 'Contact 1 Title', placeholder: 'PR Inquiries or Brand Partnerships' },
          item_1_email: { type: 'text', label: 'Contact 1 Email', placeholder: 'press@100handy.com' },
          item_2_title: { type: 'text', label: 'Contact 2 Title', placeholder: 'Social Media or Influencer Collaborations' },
          item_2_email: { type: 'text', label: 'Contact 2 Email', placeholder: 'social@100handy.com' },
          item_3_title: { type: 'text', label: 'Contact 3 Title', placeholder: 'Blog Inquiries' },
          item_3_email: { type: 'text', label: 'Contact 3 Email', placeholder: 'blog@100handy.com' },
          item_4_title: { type: 'text', label: 'Contact 4 Title', placeholder: 'Business Partnerships' },
          item_4_email: { type: 'text', label: 'Contact 4 Email', placeholder: 'partnership@100handy.com' },
        },
      },
      releases: {
        label: 'Press Releases',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Press Release Highlights' },
          item_1_date: { type: 'text', label: 'Release 1 Date', placeholder: 'September 16, 2025' },
          item_1_title: { type: 'rich_text', label: 'Release 1 Title', placeholder: '100Handy for Businesses Powers Retail Growth with On-Demand Assembly and Installation' },
          item_1_link: { type: 'text', label: 'Release 1 Link', placeholder: '#' },
          item_2_date: { type: 'text', label: 'Release 2 Date', placeholder: 'August 5, 2025' },
          item_2_title: { type: 'rich_text', label: 'Release 2 Title', placeholder: '100Handy Expands Nationwide, Bringing Trusted Home Services Across the UK and Europe' },
          item_2_link: { type: 'text', label: 'Release 2 Link', placeholder: '#' },
          item_3_date: { type: 'text', label: 'Release 3 Date', placeholder: 'June 18, 2025' },
          item_3_title: { type: 'rich_text', label: 'Release 3 Title', placeholder: '100Handy Reinvents the Customer Experience with Integrated Solutions for Partners' },
          item_3_link: { type: 'text', label: 'Release 3 Link', placeholder: '#' },
          cta_text: { type: 'text', label: 'CTA Button Text', placeholder: 'Explore' },
        },
      },
      kit: {
        label: 'Press Kit',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Press Kit' },
          description: { type: 'rich_text', label: 'Description', placeholder: 'Download 100Handy logos, brand visuals, and app screenshots.' },
          cta_text: { type: 'text', label: 'CTA Button Text', placeholder: 'Download press kit' },
        },
      },
      resources: {
        label: 'Media Resources',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Media Resources' },
          intro_1: { type: 'rich_text', label: 'Intro Line 1', placeholder: 'A collection of brand assets for your use.' },
          intro_2: { type: 'rich_text', label: 'Intro Line 2', placeholder: 'All logo and media usage must follow the 100 Handy brand guidelines. For specific media requests, please contact press@100handy.com' },
          item_1_title: { type: 'text', label: 'Resource 1 Title', placeholder: 'Download Logos' },
          item_1_link: { type: 'text', label: 'Resource 1 Link', placeholder: 'mailto:press@100handy.com' },
          item_2_title: { type: 'text', label: 'Resource 2 Title', placeholder: 'Download B-Roll' },
          item_2_link: { type: 'text', label: 'Resource 2 Link', placeholder: 'mailto:press@100handy.com' },
          item_3_title: { type: 'text', label: 'Resource 3 Title', placeholder: 'Download Fact Sheet' },
          item_3_link: { type: 'text', label: 'Resource 3 Link', placeholder: 'mailto:press@100handy.com' },
          item_4_title: { type: 'text', label: 'Resource 4 Title', placeholder: 'Download 100 Handy Pro Images' },
          item_4_link: { type: 'text', label: 'Resource 4 Link', placeholder: 'mailto:press@100handy.com' },
          item_5_title: { type: 'text', label: 'Resource 5 Title', placeholder: 'Download Product Images' },
          item_5_link: { type: 'text', label: 'Resource 5 Link', placeholder: 'mailto:press@100handy.com' },
          item_6_title: { type: 'text', label: 'Resource 6 Title', placeholder: 'Download Client Images' },
          item_6_link: { type: 'text', label: 'Resource 6 Link', placeholder: 'mailto:press@100handy.com' },
        },
      },
      story: {
        label: "What's Happening",
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: "What's happening at 100 Handy" },
          description: { type: 'rich_text', label: 'Description', placeholder: "We bring people together. It's at the heart of everything we do. We know that for every person who needs their radiator fixed before winter, the nursery set up for their newborn, or a TV mounted in time for game day, there's someone nearby who is ready, willing, and able to help." },
          image: { type: 'image_url', label: 'Section Image', placeholder: '/images/press/we-bring-people-together.jpeg' },
          cta_text: { type: 'text', label: 'CTA Button Text', placeholder: 'Read the Blog' },
        },
      },
    },
  },
  handycare: {
    label: 'HandyCares',
    slug: '/handycare',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          badge_text: { type: 'text', label: 'Badge Text', placeholder: 'HandyCares' },
          title: { type: 'text', label: 'Page Title', placeholder: 'HandyCares' },
          subtitle: { type: 'text', label: 'Subtitle', placeholder: 'Content coming soon.' },
          description: { type: 'rich_text', label: 'Description', placeholder: "We're preparing our HandyCares services and support offerings. Check back soon to learn how 100 Handy can help with care and support needs." },
        },
      },
    },
  },
  'handyman-london': {
    label: 'Handyman London',
    slug: '/handyman-london',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'rich_text', label: 'Hero Title', placeholder: 'Get Matched With\nHandyman Services in\nLondon' },
          subtitle: { type: 'rich_text', label: 'Hero Subtitle', placeholder: `If you're looking for local handyman services to\nhelp with home maintenance projects, just\nsearch "handyman near me" on 100Handy.` },
          reviews_label: { type: 'text', label: 'Reviews Label', placeholder: '500k Reviews' },
          feature_1: { type: 'rich_text', label: 'Feature 1', placeholder: 'Browse 2,500+ handyman Pros with a variety of\nskills.' },
          feature_2: { type: 'rich_text', label: 'Feature 2', placeholder: 'All Pros bring their own tools and equipment.' },
          cta_text: { type: 'text', label: 'CTA Text', placeholder: 'Book Now' },
        },
      },
      featured: {
        label: 'Featured Taskers',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: '3744 featured Handyman Pros in London' },
          cta_text: { type: 'text', label: 'Button Text', placeholder: 'Search all 100 Handy Pros' },
          item_1_name: { type: 'text', label: 'Tasker 1 Name', placeholder: 'Maria R.' },
          item_1_tasks: { type: 'text', label: 'Tasker 1 Tasks', placeholder: '90 tv mounting tasks' },
          item_1_rating: { type: 'text', label: 'Tasker 1 Rating', placeholder: '5.0' },
          item_1_reviews: { type: 'text', label: 'Tasker 1 Reviews', placeholder: '124' },
          item_1_description: { type: 'rich_text', label: 'Tasker 1 Description', placeholder: 'From start to finish, I communicate clearly and work carefully to deliver exactly what you need' },
          item_2_name: { type: 'text', label: 'Tasker 2 Name', placeholder: 'Lucas P.' },
          item_2_tasks: { type: 'text', label: 'Tasker 2 Tasks', placeholder: '31 tv mounting tasks' },
          item_2_rating: { type: 'text', label: 'Tasker 2 Rating', placeholder: '5.0' },
          item_2_reviews: { type: 'text', label: 'Tasker 2 Reviews', placeholder: '124' },
          item_2_description: { type: 'rich_text', label: 'Tasker 2 Description', placeholder: 'Friendly, punctual, and experienced—I focus on providing quality service and customer satisfaction every time.' },
          item_3_name: { type: 'text', label: 'Tasker 3 Name', placeholder: 'Marcus R.' },
          item_3_tasks: { type: 'text', label: 'Tasker 3 Tasks', placeholder: '90 tv mounting tasks' },
          item_3_rating: { type: 'text', label: 'Tasker 3 Rating', placeholder: '5.0' },
          item_3_reviews: { type: 'text', label: 'Tasker 3 Reviews', placeholder: '124' },
          item_3_description: { type: 'rich_text', label: 'Tasker 3 Description', placeholder: 'From start to finish, I communicate clearly and work carefully to deliver exactly what you need' },
          item_4_name: { type: 'text', label: 'Tasker 4 Name', placeholder: 'Lore V.' },
          item_4_tasks: { type: 'text', label: 'Tasker 4 Tasks', placeholder: '64 tv mounting tasks' },
          item_4_rating: { type: 'text', label: 'Tasker 4 Rating', placeholder: '5.0' },
          item_4_reviews: { type: 'text', label: 'Tasker 4 Reviews', placeholder: '124' },
          item_4_description: { type: 'rich_text', label: 'Tasker 4 Description', placeholder: "Whether it's a quick fix or a larger project, I'm committed to delivering dependable, professional results." },
          item_5_name: { type: 'text', label: 'Tasker 5 Name', placeholder: 'Ahmet P.' },
          item_5_tasks: { type: 'text', label: 'Tasker 5 Tasks', placeholder: '31 tv mounting tasks' },
          item_5_rating: { type: 'text', label: 'Tasker 5 Rating', placeholder: '5.0' },
          item_5_reviews: { type: 'text', label: 'Tasker 5 Reviews', placeholder: '124' },
          item_5_description: { type: 'rich_text', label: 'Tasker 5 Description', placeholder: 'Friendly, punctual, and experienced—I focus on providing quality service and customer satisfaction every time.' },
          item_6_name: { type: 'text', label: 'Tasker 6 Name', placeholder: 'Lisa O.' },
          item_6_tasks: { type: 'text', label: 'Tasker 6 Tasks', placeholder: '73 tv mounting tasks' },
          item_6_rating: { type: 'text', label: 'Tasker 6 Rating', placeholder: '5.0' },
          item_6_reviews: { type: 'text', label: 'Tasker 6 Reviews', placeholder: '124' },
          item_6_description: { type: 'rich_text', label: 'Tasker 6 Description', placeholder: 'With over 6 years of experience, I bring the right tools and skills to ensure your job is completed safely.' },
        },
      },
      satisfaction: {
        label: 'Satisfaction Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Your satisfaction, guaranteed' },
          item_1_title: { type: 'text', label: 'Item 1 Title', placeholder: 'Happiness Pledge' },
          item_1_description: { type: 'rich_text', label: 'Item 1 Description', placeholder: "If you're not satisfied, we'll work\nto make it right." },
          item_2_title: { type: 'text', label: 'Item 2 Title', placeholder: 'Vetted Pros' },
          item_2_description: { type: 'rich_text', label: 'Item 2 Description', placeholder: 'Pros are always background\nchecked before joining the\nplatform.' },
          item_3_title: { type: 'text', label: 'Item 3 Title', placeholder: 'Dedicated Support' },
          item_3_description: { type: 'rich_text', label: 'Item 3 Description', placeholder: 'Friendly service when you need us\n— every day of the week.' },
          pledge_label: { type: 'text', label: 'Bottom Pledge Label', placeholder: 'Happiness pledge' },
        },
      },
      faq: {
        label: 'FAQ Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Frequently asked questions about Handyman services in London' },
          question: { type: 'text', label: 'Question', placeholder: 'Q: What do most handyman charge per hour in London?' },
          answer: { type: 'rich_text', label: 'Answer', placeholder: 'Handyman rates in London typically range from £30-£60 per hour, depending on the complexity of the task and the experience level of the professional.' },
        },
      },
      how_it_works: {
        label: 'How It Works',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'How it works' },
          step_1: { type: 'rich_text', label: 'Step 1', placeholder: 'Choose a 100 Handy Pro by price,\nskills, and reviews.' },
          step_2: { type: 'rich_text', label: 'Step 2', placeholder: 'Schedule a Pro as early\nas today.' },
          step_3: { type: 'rich_text', label: 'Step 3', placeholder: 'Chat, pay, tip, and review,\nall in one place.' },
        },
      },
      reviews: {
        label: 'Reviews Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'See what happy customers are saying about handyman services in London' },
          cta_text: { type: 'text', label: 'Button Text', placeholder: 'Get started' },
          item_1_name: { type: 'text', label: 'Review 1 Name', placeholder: 'Michelle D.' },
          item_1_service: { type: 'text', label: 'Review 1 Service', placeholder: 'Handyman' },
          item_1_text: { type: 'rich_text', label: 'Review 1 Text', placeholder: 'Thanks to Ken for a great and efficient job fixing our fridge! He knew the problem immediately and worked efficiently and effectively!' },
          item_2_name: { type: 'text', label: 'Review 2 Name', placeholder: 'Michelle D.' },
          item_2_service: { type: 'text', label: 'Review 2 Service', placeholder: 'Handyman' },
          item_2_text: { type: 'rich_text', label: 'Review 2 Text', placeholder: 'Thanks to Ken for a great and efficient job fixing our fridge! He knew the problem immediately and worked efficiently and effectively!' },
          item_3_name: { type: 'text', label: 'Review 3 Name', placeholder: 'Michelle D.' },
          item_3_service: { type: 'text', label: 'Review 3 Service', placeholder: 'Handyman' },
          item_3_text: { type: 'rich_text', label: 'Review 3 Text', placeholder: 'Thanks to Ken for a great and efficient job fixing our fridge! He knew the problem immediately and worked efficiently and effectively!' },
          item_4_name: { type: 'text', label: 'Review 4 Name', placeholder: 'Michelle D.' },
          item_4_service: { type: 'text', label: 'Review 4 Service', placeholder: 'Handyman' },
          item_4_text: { type: 'rich_text', label: 'Review 4 Text', placeholder: 'Thanks to Ken for a great and efficient job fixing our fridge! He knew the problem immediately and worked efficiently and effectively!' },
          item_5_name: { type: 'text', label: 'Review 5 Name', placeholder: 'Michelle D.' },
          item_5_service: { type: 'text', label: 'Review 5 Service', placeholder: 'Handyman' },
          item_5_text: { type: 'rich_text', label: 'Review 5 Text', placeholder: 'Thanks to Ken for a great and efficient job fixing our fridge! He knew the problem immediately and worked efficiently and effectively!' },
          item_6_name: { type: 'text', label: 'Review 6 Name', placeholder: 'Michelle D.' },
          item_6_service: { type: 'text', label: 'Review 6 Service', placeholder: 'Handyman' },
          item_6_text: { type: 'rich_text', label: 'Review 6 Text', placeholder: 'Thanks to Ken for a great and efficient job fixing our fridge! He knew the problem immediately and worked efficiently and effectively!' },
        },
      },
      seo: {
        label: 'SEO Content',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Handyman in London' },
          item_1_title: { type: 'text', label: 'Block 1 Title', placeholder: 'Save money' },
          item_1_description: { type: 'rich_text', label: 'Block 1 Description', placeholder: 'Hiring a skilled worker to complete a job may sound costly, but finishing a project correctly the first time is far more economical than wasting time and materials while attempting to learn on the job.' },
          item_2_title: { type: 'text', label: 'Block 2 Title', placeholder: 'The expertise you need' },
          item_2_description: { type: 'rich_text', label: 'Block 2 Description', placeholder: "Whatever type of home maintenance service you're looking for, you'll find the right handyman in London on 100Handy. From simple tasks like fixture repair to more complex projects like installing new kitchen cabinets, there's a Pro with the experience you need." },
          item_3_title: { type: 'text', label: 'Block 3 Title', placeholder: 'Same-day service available' },
          item_3_description: { type: 'rich_text', label: 'Block 3 Description', placeholder: "Not everyone has repair jobs in an emergency, but if damage threatens your home's safety or security, you should address it immediately. When you shop around for local handyman services, you'll find Pros who provide last-minute appointments for urgent cases." },
          item_4_title: { type: 'text', label: 'Block 4 Title', placeholder: "There's a better way" },
          item_4_description: { type: 'rich_text', label: 'Block 4 Description', placeholder: 'Local handyman services are easy to find on 100Handy. You can chat with, hire, schedule, pay, and even tip your Pro — all on the secure 100Handy website or app.' },
        },
      },
      services: {
        label: 'Handyman Services',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Handyman Services on 100Handy' },
          intro: { type: 'rich_text', label: 'Intro', placeholder: 'London handyman services include (but are not limited to):' },
          item_1: { type: 'text', label: 'Service 1', placeholder: 'Painting and drywall' },
          item_2: { type: 'text', label: 'Service 2', placeholder: 'Door and lock installation or repair' },
          item_3: { type: 'text', label: 'Service 3', placeholder: 'Tile installation and backsplash installation' },
          item_4: { type: 'text', label: 'Service 4', placeholder: 'Furniture assembly' },
          item_5: { type: 'text', label: 'Service 5', placeholder: 'Deck and stair repair' },
          item_6: { type: 'text', label: 'Service 6', placeholder: 'Bathroom plumbing repair' },
          item_7: { type: 'text', label: 'Service 7', placeholder: 'Window installation and repair roofing' },
          closing: { type: 'rich_text', label: 'Closing Text', placeholder: "Discuss the services you need with your Pro. There's a good chance they can check off everything on your home maintenance list." },
        },
      },
      links: {
        label: 'Service Links',
        fields: {
          related_title: { type: 'text', label: 'Related Services Title', placeholder: 'Related Services' },
          popular_title: { type: 'text', label: 'Popular Services Title', placeholder: 'Popular Services in London' },
          other_title: { type: 'text', label: 'Other Services Title', placeholder: 'Other Services' },
          cta_text: { type: 'text', label: 'See More Text', placeholder: 'See more' },
          related_1_name: { type: 'text', label: 'Related 1 Name', placeholder: 'Furniture Removal' },
          related_1_link: { type: 'text', label: 'Related 1 Link', placeholder: '/services/furniture-assembly/furniture-assembly' },
          related_2_name: { type: 'text', label: 'Related 2 Name', placeholder: 'Hang Pictures' },
          related_2_link: { type: 'text', label: 'Related 2 Link', placeholder: '/services/home-repair/home-repair' },
          related_3_name: { type: 'text', label: 'Related 3 Name', placeholder: 'Tree Trimming' },
          related_3_link: { type: 'text', label: 'Related 3 Link', placeholder: '/services/gardening/gardening' },
          related_4_name: { type: 'text', label: 'Related 4 Name', placeholder: 'Electrical Help' },
          related_4_link: { type: 'text', label: 'Related 4 Link', placeholder: '/services/electrical/electrical' },
          related_5_name: { type: 'text', label: 'Related 5 Name', placeholder: 'Heavy Lifting' },
          related_5_link: { type: 'text', label: 'Related 5 Link', placeholder: '/services/moving/moving' },
          related_6_name: { type: 'text', label: 'Related 6 Name', placeholder: 'Handyman' },
          related_6_link: { type: 'text', label: 'Related 6 Link', placeholder: '/services/home-repair/home-repair' },
          popular_1_name: { type: 'text', label: 'Popular 1 Name', placeholder: 'TV Mounting' },
          popular_1_link: { type: 'text', label: 'Popular 1 Link', placeholder: '/services/home-repair/home-repair' },
          popular_2_name: { type: 'text', label: 'Popular 2 Name', placeholder: 'Furniture Assembly' },
          popular_2_link: { type: 'text', label: 'Popular 2 Link', placeholder: '/services/furniture-assembly/furniture-assembly' },
          popular_3_name: { type: 'text', label: 'Popular 3 Name', placeholder: 'House Cleaning' },
          popular_3_link: { type: 'text', label: 'Popular 3 Link', placeholder: '/services/cleaning/sparkle-clean' },
          popular_4_name: { type: 'text', label: 'Popular 4 Name', placeholder: 'Help Moving' },
          popular_4_link: { type: 'text', label: 'Popular 4 Link', placeholder: '/services/moving/moving' },
          popular_5_name: { type: 'text', label: 'Popular 5 Name', placeholder: 'Lawn Mowing' },
          popular_5_link: { type: 'text', label: 'Popular 5 Link', placeholder: '/services/gardening/gardening' },
          other_1_name: { type: 'text', label: 'Other 1 Name', placeholder: 'Furniture Disassembly' },
          other_1_link: { type: 'text', label: 'Other 1 Link', placeholder: '/services/furniture-assembly/furniture-assembly' },
          other_2_name: { type: 'text', label: 'Other 2 Name', placeholder: 'Move Out Cleaning' },
          other_2_link: { type: 'text', label: 'Other 2 Link', placeholder: '/services/cleaning/sparkle-clean' },
          other_3_name: { type: 'text', label: 'Other 3 Name', placeholder: 'Landscaping Services' },
          other_3_link: { type: 'text', label: 'Other 3 Link', placeholder: '/services/gardening/gardening' },
          other_4_name: { type: 'text', label: 'Other 4 Name', placeholder: 'Help Moving' },
          other_4_link: { type: 'text', label: 'Other 4 Link', placeholder: '/services/moving/moving' },
          other_5_name: { type: 'text', label: 'Other 5 Name', placeholder: 'Plumbing' },
          other_5_link: { type: 'text', label: 'Other 5 Link', placeholder: '/services/plumbing/plumbers' },
        },
      },
    },
  },
  'wallpapering-near-me': {
    label: 'Wallpapering Near Me',
    slug: '/wallpapering-near-me',
    sections: {
      hero: {
        label: 'Hero Section',
        fields: {
          title: { type: 'rich_text', label: 'Hero Title', placeholder: 'Wallpapering Near\nMe' },
          subtitle: { type: 'rich_text', label: 'Hero Subtitle', placeholder: 'Transform your space with expert wallpapering! Find a local 100Handy pro for quick and seamless wall decor.' },
          zip_label: { type: 'text', label: 'ZIP Label', placeholder: 'ZIP code' },
          zip_placeholder: { type: 'text', label: 'ZIP Placeholder', placeholder: 'Enter your zip code' },
          cta_text: { type: 'text', label: 'CTA Text', placeholder: 'Get quote in secs' },
          feature_1: { type: 'rich_text', label: 'Feature 1', placeholder: 'Skilled 100 Handy Pros provide precise and flawless wallpaper application.' },
          feature_2: { type: 'rich_text', label: 'Feature 2', placeholder: '100 Handy Pro can handle all types of wallpaper patterns and textures.' },
        },
      },
      featured: {
        label: 'Top Wallpaper Services',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Top Wallpaper Services near you' },
          cta_text: { type: 'text', label: 'Button Text', placeholder: 'See all' },
          item_1_name: { type: 'text', label: 'Tasker 1 Name', placeholder: 'Maria R.' },
          item_1_tasks: { type: 'text', label: 'Tasker 1 Tasks', placeholder: '90 tv mounting tasks' },
          item_1_rating: { type: 'text', label: 'Tasker 1 Rating', placeholder: '5.0' },
          item_1_reviews: { type: 'text', label: 'Tasker 1 Reviews', placeholder: '124' },
          item_1_description: { type: 'rich_text', label: 'Tasker 1 Description', placeholder: 'From start to finish, I communicate clearly and work carefully to deliver exactly what you need' },
          item_2_name: { type: 'text', label: 'Tasker 2 Name', placeholder: 'Lucas P.' },
          item_2_tasks: { type: 'text', label: 'Tasker 2 Tasks', placeholder: '31 tv mounting tasks' },
          item_2_rating: { type: 'text', label: 'Tasker 2 Rating', placeholder: '5.0' },
          item_2_reviews: { type: 'text', label: 'Tasker 2 Reviews', placeholder: '124' },
          item_2_description: { type: 'rich_text', label: 'Tasker 2 Description', placeholder: 'Friendly, punctual, and experienced—I focus on providing quality service and customer satisfaction every time.' },
          item_3_name: { type: 'text', label: 'Tasker 3 Name', placeholder: 'Marcus R.' },
          item_3_tasks: { type: 'text', label: 'Tasker 3 Tasks', placeholder: '90 tv mounting tasks' },
          item_3_rating: { type: 'text', label: 'Tasker 3 Rating', placeholder: '5.0' },
          item_3_reviews: { type: 'text', label: 'Tasker 3 Reviews', placeholder: '124' },
          item_3_description: { type: 'rich_text', label: 'Tasker 3 Description', placeholder: 'From start to finish, I communicate clearly and work carefully to deliver exactly what you need' },
          item_4_name: { type: 'text', label: 'Tasker 4 Name', placeholder: 'Lore V.' },
          item_4_tasks: { type: 'text', label: 'Tasker 4 Tasks', placeholder: '64 tv mounting tasks' },
          item_4_rating: { type: 'text', label: 'Tasker 4 Rating', placeholder: '5.0' },
          item_4_reviews: { type: 'text', label: 'Tasker 4 Reviews', placeholder: '124' },
          item_4_description: { type: 'rich_text', label: 'Tasker 4 Description', placeholder: "Whether it's a quick fix or a larger project, I'm committed to delivering dependable, professional results." },
          item_5_name: { type: 'text', label: 'Tasker 5 Name', placeholder: 'Ahmet P.' },
          item_5_tasks: { type: 'text', label: 'Tasker 5 Tasks', placeholder: '31 tv mounting tasks' },
          item_5_rating: { type: 'text', label: 'Tasker 5 Rating', placeholder: '5.0' },
          item_5_reviews: { type: 'text', label: 'Tasker 5 Reviews', placeholder: '124' },
          item_5_description: { type: 'rich_text', label: 'Tasker 5 Description', placeholder: 'Friendly, punctual, and experienced—I focus on providing quality service and customer satisfaction every time.' },
          item_6_name: { type: 'text', label: 'Tasker 6 Name', placeholder: 'Lisa O.' },
          item_6_tasks: { type: 'text', label: 'Tasker 6 Tasks', placeholder: '73 tv mounting tasks' },
          item_6_rating: { type: 'text', label: 'Tasker 6 Rating', placeholder: '5.0' },
          item_6_reviews: { type: 'text', label: 'Tasker 6 Reviews', placeholder: '124' },
          item_6_description: { type: 'rich_text', label: 'Tasker 6 Description', placeholder: 'With over 6 years of experience, I bring the right tools and skills to ensure your job is completed safely.' },
        },
      },
      satisfaction: {
        label: 'Satisfaction Section',
        fields: {
          title: { type: 'rich_text', label: 'Section Title', placeholder: 'Your satisfaction,\nguaranteed' },
          item_1_title: { type: 'text', label: 'Item 1 Title', placeholder: 'Vetted Pros' },
          item_1_description: { type: 'rich_text', label: 'Item 1 Description', placeholder: 'Pros are always background checked before joining the platform.' },
          item_2_title: { type: 'text', label: 'Item 2 Title', placeholder: 'Happiness Pledge' },
          item_2_description: { type: 'rich_text', label: 'Item 2 Description', placeholder: "If you're not satisfied, we'll work to make it right." },
          item_3_title: { type: 'text', label: 'Item 3 Title', placeholder: 'Dedicated Support' },
          item_3_description: { type: 'rich_text', label: 'Item 3 Description', placeholder: 'Friendly service when you need us — every day of the week.' },
        },
      },
      faq: {
        label: 'FAQ Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Frequently asked questions about Wallpaper Installation' },
          item_1_question: { type: 'text', label: 'FAQ 1 Question', placeholder: 'How much will wallpapering near me cost?' },
          item_1_answer: { type: 'rich_text', label: 'FAQ 1 Answer', placeholder: 'The cost of wallpapering depends on various factors including the size of the room, type of wallpaper, and complexity of the project. On average, you can expect to pay between £30-£80 per hour for professional wallpapering services.' },
          item_2_question: { type: 'text', label: 'FAQ 2 Question', placeholder: 'How long does wallpapering take?' },
          item_2_answer: { type: 'rich_text', label: 'FAQ 2 Answer', placeholder: 'The time required for wallpapering varies based on room size and complexity. A standard bedroom typically takes 4-6 hours, while larger rooms or complex patterns may take 1-2 days.' },
          item_3_question: { type: 'text', label: 'FAQ 3 Question', placeholder: "What's included in 100Handy wallpaper task?" },
          item_3_answer: { type: 'rich_text', label: 'FAQ 3 Answer', placeholder: 'Our wallpaper service includes surface preparation, professional wallpaper application, trimming, and cleanup. You provide the wallpaper, and our skilled 100 Handy Pros handle the rest!' },
        },
      },
      blog: {
        label: 'Blog Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Explore our blog' },
          intro: { type: 'rich_text', label: 'Intro', placeholder: "We're unlocking community knowledge in a new way. Experts add insights directly into each article, started with the help of AI." },
          item_1_title: { type: 'text', label: 'Post 1 Title', placeholder: 'Smart Ways to Refresh Your Walls' },
          item_1_description: { type: 'rich_text', label: 'Post 1 Description', placeholder: 'Wallpapering can easily transform any room in your home, enhancing its beauty...' },
          item_1_image: { type: 'image_url', label: 'Post 1 Image', placeholder: '/images/blog-1.png' },
          item_2_title: { type: 'text', label: 'Post 2 Title', placeholder: 'Smart Ways to Refresh Your Walls' },
          item_2_description: { type: 'rich_text', label: 'Post 2 Description', placeholder: 'Wallpapering can easily transform any room in your home, enhancing its beauty...' },
          item_2_image: { type: 'image_url', label: 'Post 2 Image', placeholder: '/images/blog-2.png' },
          item_3_title: { type: 'text', label: 'Post 3 Title', placeholder: 'Smart Ways to Refresh Your Walls' },
          item_3_description: { type: 'rich_text', label: 'Post 3 Description', placeholder: 'Wallpapering can easily transform any room in your home, enhancing its beauty...' },
          item_3_image: { type: 'image_url', label: 'Post 3 Image', placeholder: '/images/blog-3.png' },
          item_4_title: { type: 'text', label: 'Post 4 Title', placeholder: 'Smart Ways to Refresh Your Walls' },
          item_4_description: { type: 'rich_text', label: 'Post 4 Description', placeholder: 'Wallpapering can easily transform any room in your home, enhancing its beauty...' },
          item_4_image: { type: 'image_url', label: 'Post 4 Image', placeholder: '/images/blog-4.png' },
          item_5_title: { type: 'text', label: 'Post 5 Title', placeholder: 'Smart Ways to Refresh Your Walls' },
          item_5_description: { type: 'rich_text', label: 'Post 5 Description', placeholder: 'Wallpapering can easily transform any room in your home, enhancing its beauty...' },
          item_5_image: { type: 'image_url', label: 'Post 5 Image', placeholder: '/images/blog-5.png' },
          item_6_title: { type: 'text', label: 'Post 6 Title', placeholder: 'Smart Ways to Refresh Your Walls' },
          item_6_description: { type: 'rich_text', label: 'Post 6 Description', placeholder: 'Wallpapering can easily transform any room in your home, enhancing its beauty...' },
          item_6_image: { type: 'image_url', label: 'Post 6 Image', placeholder: '/images/blog-6.png' },
        },
      },
      reviews: {
        label: 'Reviews Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'See what happy customers are saying about handyman services in London' },
          cta_text: { type: 'text', label: 'Button Text', placeholder: 'See all' },
          item_1_name: { type: 'text', label: 'Review 1 Name', placeholder: 'Michelle D.' },
          item_1_text: { type: 'rich_text', label: 'Review 1 Text', placeholder: 'Thanks to Ken for a great and efficient job fixing our fridge! He knew the problem immediately and worked efficiently and effectively!' },
          item_2_name: { type: 'text', label: 'Review 2 Name', placeholder: 'Michelle D.' },
          item_2_text: { type: 'rich_text', label: 'Review 2 Text', placeholder: 'Thanks to Ken for a great and efficient job fixing our fridge! He knew the problem immediately and worked efficiently and effectively!' },
          item_3_name: { type: 'text', label: 'Review 3 Name', placeholder: 'Michelle D.' },
          item_3_text: { type: 'rich_text', label: 'Review 3 Text', placeholder: 'Thanks to Ken for a great and efficient job fixing our fridge! He knew the problem immediately and worked efficiently and effectively!' },
          item_4_name: { type: 'text', label: 'Review 4 Name', placeholder: 'Michelle D.' },
          item_4_text: { type: 'rich_text', label: 'Review 4 Text', placeholder: 'Thanks to Ken for a great and efficient job fixing our fridge! He knew the problem immediately and worked efficiently and effectively!' },
          item_5_name: { type: 'text', label: 'Review 5 Name', placeholder: 'Michelle D.' },
          item_5_text: { type: 'rich_text', label: 'Review 5 Text', placeholder: 'Thanks to Ken for a great and efficient job fixing our fridge! He knew the problem immediately and worked efficiently and effectively!' },
          item_6_name: { type: 'text', label: 'Review 6 Name', placeholder: 'Michelle D.' },
          item_6_text: { type: 'rich_text', label: 'Review 6 Text', placeholder: 'Thanks to Ken for a great and efficient job fixing our fridge! He knew the problem immediately and worked efficiently and effectively!' },
        },
      },
      stats: {
        label: 'Join Millions Section',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Join millions in enjoying easy Wallpaper Installation' },
          item_1_value: { type: 'text', label: 'Stat 1 Value', placeholder: '1.4 million' },
          item_1_label: { type: 'text', label: 'Stat 1 Label', placeholder: 'Customers' },
          item_2_value: { type: 'text', label: 'Stat 2 Value', placeholder: '4.5 Stars' },
          item_2_label: { type: 'text', label: 'Stat 2 Label', placeholder: 'Average Rating' },
          item_3_value: { type: 'text', label: 'Stat 3 Value', placeholder: '500K Reviews' },
          item_3_label: { type: 'text', label: 'Stat 3 Label', placeholder: 'Verified' },
        },
      },
      related: {
        label: 'You Might Also Like',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'You Might Also Like' },
          cta_text: { type: 'text', label: 'Button Text', placeholder: 'See more services' },
          item_1_name: { type: 'text', label: 'Service 1 Name', placeholder: 'Furniture Rearranging' },
          item_1_image: { type: 'image_url', label: 'Service 1 Image', placeholder: '/images/service-1.png' },
          item_2_name: { type: 'text', label: 'Service 2 Name', placeholder: 'Blinds Repair' },
          item_2_image: { type: 'image_url', label: 'Service 2 Image', placeholder: '/images/service-2.png' },
          item_3_name: { type: 'text', label: 'Service 3 Name', placeholder: 'Ceiling Fan Installation' },
          item_3_image: { type: 'image_url', label: 'Service 3 Image', placeholder: '/images/service-3.png' },
          item_4_name: { type: 'text', label: 'Service 4 Name', placeholder: 'Drywall Repair' },
          item_4_image: { type: 'image_url', label: 'Service 4 Image', placeholder: '/images/service-4.png' },
          item_5_name: { type: 'text', label: 'Service 5 Name', placeholder: 'Door Repair' },
          item_5_image: { type: 'image_url', label: 'Service 5 Image', placeholder: '/images/service-5.png' },
          item_6_name: { type: 'text', label: 'Service 6 Name', placeholder: 'Window Repair' },
          item_6_image: { type: 'image_url', label: 'Service 6 Image', placeholder: '/images/service-6.png' },
        },
      },
      seo: {
        label: 'SEO Content',
        fields: {
          title: { type: 'text', label: 'Section Title', placeholder: 'Handyman in London' },
          item_1_title: { type: 'text', label: 'Block 1 Title', placeholder: 'Where money' },
          item_1_description: { type: 'rich_text', label: 'Block 1 Description', placeholder: "Whatever it is that needs doing, chances are great that there's a 100 Handy Pro in London who'd love to help you with it! Since there's a wide variety of home improvement tasks available, here's a brief list of the most popular ones on 100handy:" },
          item_2_title: { type: 'text', label: 'Block 2 Title', placeholder: 'The expertise you need' },
          item_2_description: { type: 'rich_text', label: 'Block 2 Description', placeholder: "Before hiring a 100 Handy Pro on 100handy, check out their reviews, ratings, and the tasks they've completed for other customers. Get more information on each 100 Handy Pro by going to their unique profile page. When you like what you see, pick the 100 Handy Pro that's right for you, and they'll get to work on your home project!" },
          item_3_title: { type: 'text', label: 'Block 3 Title', placeholder: 'When day service available' },
          item_3_description: { type: 'rich_text', label: 'Block 3 Description', placeholder: 'Same-day booking is available on 100handy. You can also browse prices and choose a time that works best for you and your 100 Handy Pro. Need help? Rely on our dedicated customer support team to assist with any questions. Communication with your 100 Handy Pro is easy on 100handy—you can chat to sort out the details before booking, or contact them after the job.' },
          item_4_title: { type: 'text', label: 'Block 4 Title', placeholder: "There's a pro map" },
          item_4_description: { type: 'rich_text', label: 'Block 4 Description', placeholder: "Convenient services that fit your schedule and budget are just a click away. You can book online, knowing that you're backed by our Happiness Pledge." },
        },
      },
    },
  },
}

/** Get all page keys */
export function getPageKeys(): string[] {
  return Object.keys(pageRegistry)
}

/** Get a flat list of all field keys for a page (e.g. "hero.title") */
export function getPageFieldKeys(pageKey: string): string[] {
  const page = pageRegistry[pageKey]
  if (!page) return []
  const keys: string[] = []
  for (const [sectionKey, section] of Object.entries(page.sections)) {
    for (const fieldKey of Object.keys(section.fields)) {
      keys.push(`${sectionKey}.${fieldKey}`)
    }
  }
  return keys
}
