/**
 * Data Validation Module for HMA Dashboard
 * Ensures data integrity and consistency
 */

class DataValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  // Reset validation state
  reset() {
    this.errors = [];
    this.warnings = [];
  }

  // Email metrics validation
  validateEmailMetrics(data) {
    this.reset();
    
    // Required fields
    if (!data.period) {
      this.errors.push('Period is required');
    }
    
    if (typeof data.opens !== 'number' || data.opens < 0) {
      this.errors.push('Opens must be a positive number');
    }
    
    if (typeof data.clicks !== 'number' || data.clicks < 0) {
      this.errors.push('Clicks must be a positive number');
    }
    
    // Logical checks
    if (data.clicks > data.opens) {
      this.errors.push('Clicks cannot exceed opens');
    }
    
    // Rate validations
    if (data.openRate) {
      const openRate = parseFloat(data.openRate.replace('%', ''));
      if (isNaN(openRate) || openRate < 0 || openRate > 100) {
        this.errors.push('Open rate must be between 0-100%');
      }
    }
    
    if (data.clickThroughRate) {
      const ctr = parseFloat(data.clickThroughRate.replace('%', ''));
      if (isNaN(ctr) || ctr < 0 || ctr > 100) {
        this.errors.push('Click-through rate must be between 0-100%');
      }
    }
    
    // Warning for unusual values
    if (data.openRate) {
      const openRate = parseFloat(data.openRate.replace('%', ''));
      if (openRate > 80) {
        this.warnings.push('Unusually high open rate detected');
      }
      if (openRate < 10) {
        this.warnings.push('Unusually low open rate detected');
      }
    }
    
    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  // Website metrics validation
  validateWebsiteMetrics(data) {
    this.reset();
    
    if (!data.period || !data.periodLabel) {
      this.errors.push('Period information is required');
    }
    
    if (typeof data.visitors !== 'number' || data.visitors < 0) {
      this.errors.push('Visitors must be a positive number');
    }
    
    if (typeof data.sessions !== 'number' || data.sessions < 0) {
      this.errors.push('Sessions must be a positive number');
    }
    
    if (typeof data.pageViews !== 'number' || data.pageViews < 0) {
      this.errors.push('Page views must be a positive number');
    }
    
    // Logical checks
    if (data.sessions < data.visitors) {
      this.errors.push('Sessions cannot be less than visitors');
    }
    
    if (data.pageViews < data.sessions) {
      this.warnings.push('Page views less than sessions is unusual');
    }
    
    // Bounce rate validation
    if (data.bounceRate) {
      const bounceRate = typeof data.bounceRate === 'string' 
        ? parseFloat(data.bounceRate.replace('%', '')) / 100
        : data.bounceRate;
        
      if (isNaN(bounceRate) || bounceRate < 0 || bounceRate > 1) {
        this.errors.push('Bounce rate must be between 0-100%');
      }
    }
    
    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  // LinkedIn metrics validation
  validateLinkedInMetrics(data) {
    this.reset();
    
    if (!data.period) {
      this.errors.push('Period is required');
    }
    
    if (typeof data.impressions !== 'number' || data.impressions < 0) {
      this.errors.push('Impressions must be a positive number');
    }
    
    if (typeof data.engagements !== 'number' || data.engagements < 0) {
      this.errors.push('Engagements must be a positive number');
    }
    
    if (typeof data.followers !== 'number' || data.followers < 0) {
      this.errors.push('Followers must be a positive number');
    }
    
    // Logical checks
    if (data.engagements > data.impressions) {
      this.errors.push('Engagements cannot exceed impressions');
    }
    
    // Engagement rate check
    if (data.impressions > 0) {
      const engagementRate = (data.engagements / data.impressions) * 100;
      if (engagementRate > 30) {
        this.warnings.push('Unusually high engagement rate detected');
      }
    }
    
    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  // Validate date format
  validateDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return false;
    }
    
    // Check if date is not in the future
    if (date > new Date()) {
      this.warnings.push(`Date ${dateString} is in the future`);
    }
    
    return true;
  }

  // Compare metrics for consistency
  compareMetrics(current, previous) {
    const changes = {};
    
    // Calculate percentage changes
    if (previous.opens && current.opens) {
      changes.opensChange = ((current.opens - previous.opens) / previous.opens) * 100;
      
      if (Math.abs(changes.opensChange) > 200) {
        this.warnings.push(`Opens changed by ${changes.opensChange.toFixed(1)}% - verify this is correct`);
      }
    }
    
    if (previous.clicks && current.clicks) {
      changes.clicksChange = ((current.clicks - previous.clicks) / previous.clicks) * 100;
      
      if (Math.abs(changes.clicksChange) > 300) {
        this.warnings.push(`Clicks changed by ${changes.clicksChange.toFixed(1)}% - verify this is correct`);
      }
    }
    
    return changes;
  }
}

module.exports = new DataValidator();