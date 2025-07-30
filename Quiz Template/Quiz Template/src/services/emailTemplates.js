import mjml from 'mjml';
import mustache from 'mustache';
import juice from 'juice';

export class EmailTemplateService {
  constructor() {
    this.templates = new Map();
    this.initializeDefaultTemplates();
  }

  initializeDefaultTemplates() {
    // Quiz completion email template
    this.templates.set('quiz-completion', {
      subject: 'Your {{quizTitle}} Results Are Here!',
      mjml: `
        <mjml>
          <mj-head>
            <mj-title>Quiz Results</mj-title>
            <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700" />
            <mj-attributes>
              <mj-all font-family="Inter, Arial, sans-serif" />
            </mj-attributes>
          </mj-head>
          <mj-body background-color="#f8fafc">
            <mj-section background-color="#ffffff" padding="0px">
              <mj-column>
                <mj-image src="{{logoUrl}}" alt="Logo" width="120px" padding="30px 0 20px 0" />
              </mj-column>
            </mj-section>

            <mj-section background-color="#ffffff" padding="20px">
              <mj-column>
                <mj-text font-size="28px" font-weight="600" color="#1f2937" align="center" padding-bottom="10px">
                  Congratulations, {{firstName}}!
                </mj-text>
                
                <mj-text font-size="16px" color="#6b7280" align="center" padding-bottom="30px">
                  You've completed the <strong>{{quizTitle}}</strong>
                </mj-text>

                <mj-section background-color="#3b82f6" border-radius="12px" padding="30px">
                  <mj-column>
                    <mj-text color="#ffffff" font-size="18px" font-weight="500" align="center" padding-bottom="10px">
                      Your Score
                    </mj-text>
                    <mj-text color="#ffffff" font-size="48px" font-weight="700" align="center" padding-bottom="10px">
                      {{score}}%
                    </mj-text>
                    <mj-text color="#e5f3ff" font-size="14px" align="center">
                      {{correctAnswers}} out of {{totalQuestions}} correct
                    </mj-text>
                  </mj-column>
                </mj-section>

                <mj-text font-size="16px" color="#374151" padding="30px 0 20px 0">
                  {{personalizedMessage}}
                </mj-text>

                {{#recommendations}}
                <mj-section background-color="#f8fafc" border-radius="8px" padding="20px">
                  <mj-column>
                    <mj-text font-size="18px" font-weight="600" color="#1f2937" padding-bottom="15px">
                      Personalized Recommendations
                    </mj-text>
                    {{#items}}
                    <mj-text font-size="14px" color="#374151" padding="5px 0">
                      • {{.}}
                    </mj-text>
                    {{/items}}
                  </mj-column>
                </mj-section>
                {{/recommendations}}

                {{#hasCallToAction}}
                <mj-button background-color="#10b981" border-radius="8px" font-size="16px" font-weight="600" padding="30px 0">
                  {{ctaText}}
                </mj-button>
                {{/hasCallToAction}}

                <mj-divider border-color="#e5e7eb" border-width="1px" padding="30px 0" />

                <mj-text font-size="14px" color="#6b7280" align="center">
                  Want to share your results? 
                  <a href="{{shareUrl}}" style="color: #3b82f6; text-decoration: none;">Share on social media</a>
                </mj-text>
              </mj-column>
            </mj-section>

            <mj-section background-color="#f9fafb" padding="30px 20px">
              <mj-column>
                <mj-text font-size="12px" color="#9ca3af" align="center">
                  You received this email because you completed our quiz.
                  <br />
                  <a href="{{unsubscribeUrl}}" style="color: #6b7280;">Unsubscribe</a>
                </mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `
    });

    // Welcome/Lead magnet email
    this.templates.set('welcome-lead', {
      subject: 'Welcome! Your {{leadMagnetTitle}} is attached',
      mjml: `
        <mjml>
          <mj-head>
            <mj-title>Welcome & Lead Magnet</mj-title>
            <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700" />
          </mj-head>
          <mj-body background-color="#f8fafc">
            <mj-section background-color="#ffffff" padding="40px 20px">
              <mj-column>
                <mj-image src="{{logoUrl}}" alt="Logo" width="120px" padding-bottom="30px" />
                
                <mj-text font-size="24px" font-weight="600" color="#1f2937" padding-bottom="20px">
                  Welcome to our community, {{firstName}}!
                </mj-text>
                
                <mj-text font-size="16px" color="#374151" line-height="24px" padding-bottom="30px">
                  Thank you for taking our quiz! As promised, here's your personalized 
                  <strong>{{leadMagnetTitle}}</strong> based on your responses.
                </mj-text>

                <mj-section background-color="#ecfdf5" border-radius="8px" padding="20px">
                  <mj-column>
                    <mj-text font-size="16px" color="#059669" font-weight="500" padding-bottom="10px">
                      📎 Attachment: {{leadMagnetTitle}}
                    </mj-text>
                    <mj-text font-size="14px" color="#065f46">
                      This guide is tailored specifically for {{userSegment}} like you.
                    </mj-text>
                  </mj-column>
                </mj-section>

                <mj-text font-size="16px" color="#374151" line-height="24px" padding="30px 0">
                  Over the next few days, I'll be sending you more valuable insights about {{topic}}. 
                  Keep an eye on your inbox!
                </mj-text>

                <mj-button background-color="#3b82f6" border-radius="8px" font-size="16px" font-weight="600">
                  Get Started Now
                </mj-button>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `
    });

    // Follow-up sequence email
    this.templates.set('follow-up', {
      subject: 'Quick question about your {{quizTitle}} results...',
      mjml: `
        <mjml>
          <mj-head>
            <mj-title>Follow-up Email</mj-title>
            <mj-font name="Inter" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700" />
          </mj-head>
          <mj-body background-color="#f8fafc">
            <mj-section background-color="#ffffff" padding="40px 20px">
              <mj-column>
                <mj-text font-size="18px" color="#374151" padding-bottom="20px">
                  Hi {{firstName}},
                </mj-text>
                
                <mj-text font-size="16px" color="#374151" line-height="24px" padding-bottom="20px">
                  I hope you found your {{quizTitle}} results helpful! 
                </mj-text>

                <mj-text font-size="16px" color="#374151" line-height="24px" padding-bottom="20px">
                  Since you scored {{score}}% and identified as {{userProfile}}, 
                  I wanted to follow up with a quick question:
                </mj-text>

                <mj-section background-color="#fef3c7" border-radius="8px" padding="20px">
                  <mj-column>
                    <mj-text font-size="16px" color="#92400e" font-weight="500" padding-bottom="10px">
                      What's your biggest challenge with {{challengeArea}} right now?
                    </mj-text>
                  </mj-column>
                </mj-section>

                <mj-text font-size="16px" color="#374151" line-height="24px" padding="20px 0">
                  I ask because I've helped hundreds of {{userType}} overcome similar challenges, 
                  and I'd love to share some specific strategies that might help you.
                </mj-text>

                <mj-button background-color="#10b981" border-radius="8px" font-size="16px" font-weight="600">
                  Reply & Tell Me
                </mj-button>

                <mj-text font-size="14px" color="#6b7280" padding="30px 0 0 0">
                  Best regards,<br />
                  {{senderName}}
                </mj-text>
              </mj-column>
            </mj-section>
          </mj-body>
        </mjml>
      `
    });
  }

  // Generate HTML email from template
  generateEmail(templateName, data) {
    const template = this.templates.get(templateName);
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    try {
      // Render MJML with data using Mustache
      const renderedMjml = mustache.render(template.mjml, data);
      
      // Convert MJML to HTML
      const mjmlResult = mjml(renderedMjml);
      
      if (mjmlResult.errors.length > 0) {
        console.warn('MJML warnings:', mjmlResult.errors);
      }

      // Inline CSS for better email client compatibility
      const inlinedHtml = juice(mjmlResult.html);

      // Render subject line
      const subject = mustache.render(template.subject, data);

      return {
        subject,
        html: inlinedHtml,
        text: this.generateTextVersion(inlinedHtml)
      };
    } catch (error) {
      console.error('Email generation error:', error);
      throw error;
    }
  }

  // Generate plain text version of email
  generateTextVersion(html) {
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  // Add custom template
  addTemplate(name, template) {
    this.templates.set(name, template);
  }

  // Get personalized message based on quiz score
  getPersonalizedMessage(score, quizType) {
    if (quizType === 'personality') {
      if (score >= 80) return "You're a natural leader with great instincts!";
      if (score >= 60) return "You have solid foundations with room to grow.";
      return "This is just the beginning of your journey!";
    }
    
    if (quizType === 'knowledge') {
      if (score >= 90) return "Outstanding! You're clearly an expert in this area.";
      if (score >= 70) return "Great job! You have a strong understanding.";
      if (score >= 50) return "Good effort! There's definitely room for improvement.";
      return "Don't worry - everyone starts somewhere!";
    }

    return "Thank you for taking the time to complete our quiz!";
  }

  // Get recommendations based on quiz results
  getRecommendations(quizData) {
    const recommendations = [];
    
    // Logic based on quiz responses
    if (quizData.businessStage === 'startup') {
      recommendations.push('Focus on validating your product-market fit');
      recommendations.push('Build a solid foundation with proper legal structure');
      recommendations.push('Network with other entrepreneurs in your industry');
    }
    
    if (quizData.challenges?.includes('lead-generation')) {
      recommendations.push('Implement a content marketing strategy');
      recommendations.push('Optimize your website for conversions');
      recommendations.push('Set up email marketing automation');
    }

    return recommendations.length > 0 ? { items: recommendations } : null;
  }

  // Send email using configured email service
  async sendEmail(to, templateName, data, options = {}) {
    const emailContent = this.generateEmail(templateName, data);
    
    const emailData = {
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
      ...options
    };

    // This would integrate with your email service (Nodemailer, SendGrid, etc.)
    // Implementation depends on your chosen email provider
    try {
      // Example with Nodemailer
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransporter({
        // Your email configuration
      });

      const result = await transporter.sendMail(emailData);
      return result;
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  }

  // Automated email sequence
  async scheduleEmailSequence(userId, templateSequence, userData, delays = []) {
    const sequence = [];
    
    templateSequence.forEach((templateName, index) => {
      const delay = delays[index] || 0; // Delay in hours
      
      sequence.push({
        userId,
        templateName,
        userData,
        scheduledFor: new Date(Date.now() + delay * 60 * 60 * 1000),
        status: 'pending'
      });
    });

    // Save sequence to database
    // This would typically use your database service
    return sequence;
  }
}

// Pre-configured email sequences
export const EMAIL_SEQUENCES = {
  QUIZ_COMPLETION: [
    'quiz-completion',    // Immediate
    'follow-up',         // 1 day later
    'value-content',     // 3 days later
    'case-study',        // 7 days later
    'consultation-offer' // 14 days later
  ],
  
  LEAD_NURTURE: [
    'welcome-lead',      // Immediate
    'education-1',       // 2 days later
    'education-2',       // 5 days later
    'social-proof',      // 8 days later
    'soft-pitch'         // 12 days later
  ]
};

export default new EmailTemplateService();