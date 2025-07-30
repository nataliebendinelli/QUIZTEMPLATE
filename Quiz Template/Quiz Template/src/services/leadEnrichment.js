import clearbit from 'clearbit';

// Initialize Clearbit with your API key
const client = clearbit(process.env.CLEARBIT_API_KEY);

export class LeadEnrichmentService {
  /**
   * Enrich lead data using Clearbit
   */
  async enrichLead(email) {
    try {
      const person = await client.Enrichment.find({
        email: email,
        stream: true
      });

      return {
        enriched: true,
        data: {
          fullName: person.name.fullName,
          firstName: person.name.givenName,
          lastName: person.name.familyName,
          title: person.employment.title,
          company: person.employment.name,
          companyDomain: person.employment.domain,
          location: person.geo.city + ', ' + person.geo.state,
          linkedin: person.linkedin.handle,
          twitter: person.twitter.handle,
          bio: person.bio,
          avatar: person.avatar,
          companySummary: {
            name: person.company?.name,
            domain: person.company?.domain,
            industry: person.company?.category?.industry,
            employeeCount: person.company?.metrics?.employees,
            revenue: person.company?.metrics?.estimatedAnnualRevenue,
            tags: person.company?.tags
          }
        }
      };
    } catch (error) {
      console.error('Clearbit enrichment error:', error);
      return {
        enriched: false,
        error: error.message
      };
    }
  }

  /**
   * Score lead quality based on enriched data
   */
  calculateLeadScore(enrichedData) {
    let score = 0;
    const scoreFactors = {
      hasTitle: 10,
      seniorTitle: 20,
      hasCompany: 15,
      largeCompany: 25,
      hasLinkedIn: 10,
      hasRevenue: 20
    };

    // Check job title
    if (enrichedData.title) {
      score += scoreFactors.hasTitle;
      if (this.isSeniorTitle(enrichedData.title)) {
        score += scoreFactors.seniorTitle;
      }
    }

    // Check company info
    if (enrichedData.company) {
      score += scoreFactors.hasCompany;
      if (enrichedData.companySummary?.employeeCount > 100) {
        score += scoreFactors.largeCompany;
      }
    }

    // Check social presence
    if (enrichedData.linkedin) {
      score += scoreFactors.hasLinkedIn;
    }

    // Check company revenue
    if (enrichedData.companySummary?.revenue) {
      score += scoreFactors.hasRevenue;
    }

    return {
      score,
      category: this.getLeadCategory(score),
      factors: this.getScoreFactors(enrichedData)
    };
  }

  isSeniorTitle(title) {
    const seniorKeywords = [
      'CEO', 'CTO', 'CFO', 'COO', 'CMO',
      'VP', 'Vice President', 'Director',
      'Head of', 'Manager', 'Lead'
    ];
    
    return seniorKeywords.some(keyword => 
      title.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  getLeadCategory(score) {
    if (score >= 80) return 'Hot';
    if (score >= 50) return 'Warm';
    if (score >= 30) return 'Cool';
    return 'Cold';
  }

  getScoreFactors(data) {
    return {
      jobTitle: data.title || 'Unknown',
      company: data.company || 'Unknown',
      companySize: data.companySummary?.employeeCount || 'Unknown',
      industry: data.companySummary?.industry || 'Unknown',
      location: data.location || 'Unknown'
    };
  }

  /**
   * Bulk enrich multiple leads
   */
  async bulkEnrichLeads(emails) {
    const enrichmentPromises = emails.map(email => 
      this.enrichLead(email).catch(err => ({
        email,
        enriched: false,
        error: err.message
      }))
    );

    return Promise.all(enrichmentPromises);
  }

  /**
   * Save enriched data to database
   */
  async saveEnrichedLead(leadId, enrichedData) {
    // Implementation depends on your database
    // Example with MongoDB/Mongoose:
    /*
    const Lead = require('../models/Lead');
    
    return Lead.findByIdAndUpdate(leadId, {
      enrichedData: enrichedData.data,
      leadScore: this.calculateLeadScore(enrichedData.data),
      enrichedAt: new Date()
    }, { new: true });
    */
  }
}

// Alternative: Using a GraphQL approach for custom enrichment
export class CustomLeadEnrichment {
  constructor(apolloClient) {
    this.client = apolloClient;
  }

  async enrichFromMultipleSources(email) {
    const enrichmentQueries = `
      query EnrichLead($email: String!) {
        clearbit: getClearbitData(email: $email) {
          name
          company
          title
        }
        hunter: getHunterData(email: $email) {
          firstName
          lastName
          position
          company
        }
        custom: getCustomData(email: $email) {
          socialProfiles
          interests
          recentActivity
        }
      }
    `;

    try {
      const { data } = await this.client.query({
        query: gql(enrichmentQueries),
        variables: { email }
      });

      return this.mergeEnrichmentData(data);
    } catch (error) {
      console.error('GraphQL enrichment error:', error);
      return null;
    }
  }

  mergeEnrichmentData(sources) {
    // Merge data from multiple sources with priority
    return {
      name: sources.clearbit?.name || sources.hunter?.firstName + ' ' + sources.hunter?.lastName,
      company: sources.clearbit?.company || sources.hunter?.company,
      title: sources.clearbit?.title || sources.hunter?.position,
      socialProfiles: sources.custom?.socialProfiles || [],
      interests: sources.custom?.interests || [],
      recentActivity: sources.custom?.recentActivity || []
    };
  }
}

export default new LeadEnrichmentService();