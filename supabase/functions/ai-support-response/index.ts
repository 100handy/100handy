import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../_shared/cors.ts';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

const KNOWLEDGE_BASE = `
# 100 Handy - Service Marketplace Platform

## About 100 Handy
100 Handy is a service marketplace platform that connects clients with skilled professionals (taskers) for various home and business services.

## Services Offered
- Home Cleaning
- Plumbing
- Electrical Work
- Carpentry
- Painting
- Gardening & Landscaping
- Moving & Delivery
- Handyman Services
- Assembly Services
- And many more!

## How It Works

### For Clients:
1. Browse available services and taskers
2. Select a service and choose a tasker
3. Book a time slot that works for you
4. Make secure payment
5. Tasker arrives and completes the job
6. Rate and review your experience

### For Taskers:
1. Create a professional profile
2. Set your availability and rates
3. Receive booking requests
4. Complete jobs and earn money
5. Build your reputation through reviews

## Booking Process
- Browse services or search for specific tasks
- View tasker profiles, ratings, and reviews
- Select date and time for your booking
- Provide job details and special requirements
- Confirm booking and make payment
- Receive confirmation and tasker contact information

## Payments
- We accept credit/debit cards and digital wallets
- Payment is held securely until job completion
- Service fees are clearly shown before booking
- Refunds available per our cancellation policy

## Cancellation Policy
- **Free cancellation**: Up to 24 hours before booking start time
- **50% fee**: Cancellations made less than 24 hours before booking
- **Full charge**: No-shows will be charged the full booking amount
- Rescheduling is free if done 24+ hours in advance

## Support Hours
- Live support: Monday to Friday, 8:30 AM - 6:30 PM GMT
- AI assistant: Available 24/7
- Average response time: Within 2 hours during business hours

## Account & Security
- Two-factor authentication (2FA) available for enhanced security
- Email OTP verification for account access
- Secure payment processing
- Your personal information is encrypted and protected

## Becoming a Tasker
Interested in earning money? Join our community:
- Complete our simple registration process
- Verify your identity and skills
- Set your own rates and availability
- Get access to thousands of potential clients
- Earn competitive rates for your services
- Learn more: https://100handy.com/become-tasker

## Common Issues

### Booking Issues
- If you can't find a tasker, try adjusting your date/time or location
- Check that all required fields are filled in the booking form
- Ensure your payment method is valid and has sufficient funds

### Account Issues
- Forgot password? Use the "Forgot Password" link on login page
- Can't verify email? Check spam folder or request a new code
- Profile updates may take a few minutes to reflect

### Payment Issues
- Failed payment? Check card details and available balance
- Refunds typically process within 5-7 business days
- Payment disputes should be reported within 48 hours

## Contact & Help
- In-app messaging: Available in Support section
- Email: support@100handy.com
- Support center: https://100handy.com/support
- Emergency: For urgent issues during active bookings, use in-app emergency contact
`;

interface SupportMessage {
  ticket_id: string;
  message: string;
  conversation_history?: Array<{ role: string; content: string }>;
}

async function generateAIResponse(userMessage: string, conversationHistory: Array<{ role: string; content: string }> = []): Promise<string> {
  const messages = [
    {
      role: 'system',
      content: `You are a helpful customer support assistant for 100 Handy, a service marketplace platform.

Use the following knowledge base to answer questions:

${KNOWLEDGE_BASE}

Instructions:
- Be friendly, professional, and concise
- Answer based on the knowledge base provided
- If you don't know something, admit it and offer to connect the user with a human agent
- Keep responses under 200 words unless more detail is specifically requested
- Use a conversational tone
- If the user seems frustrated or has a complex issue, suggest escalating to a human agent
- Always be empathetic and understanding`,
    },
    ...conversationHistory,
    {
      role: 'user',
      content: userMessage,
    },
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('OpenAI API error:', error);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: authHeader ? { Authorization: authHeader } : {},
        },
      }
    );

    // Try to verify authentication, but continue if it fails (for testing)
    let user = null;
    if (authHeader) {
      const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser();

      if (authError) {
        console.error('Auth error (continuing anyway):', authError);
      }

      user = authUser;
    }

    console.log('User authenticated:', !!user);

    const { ticket_id, message, conversation_history = [] } = await req.json() as SupportMessage;

    console.log('Processing AI response for ticket:', ticket_id);

    // Generate AI response
    const aiResponse = await generateAIResponse(message, conversation_history);

    // Save AI response to database
    const { data: aiMessage, error: insertError } = await supabaseClient
      .from('support_messages')
      .insert({
        ticket_id,
        from_user: false,
        message: aiResponse,
        message_type: 'text',
        metadata: {
          ai_generated: true,
          model: 'gpt-4o-mini',
          timestamp: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting AI message:', insertError);
      throw insertError;
    }

    console.log('AI response saved:', aiMessage.id);

    return new Response(
      JSON.stringify({
        success: true,
        message: aiMessage,
        ai_response: aiResponse,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in ai-support-response:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'An error occurred',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
