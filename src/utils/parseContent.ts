import { ConceptSection } from '../types';

export function parseConceptContent(content: string | undefined): ConceptSection[] {
  if (!content) {
    return [];
  }

  const sections: ConceptSection[] = [];
  
  // Regular expressions to match different header styles
  const headerPatterns = [
    // Headers with emojis and time ranges
    /(?:##|#)\s*([🌅🔑🌈🌍💡🧱🏗️🧩🔍🚀❓💭🌟📝🧠🔬📚💡🚨✏️]\s*.*?)(?:\s*\((\d+)-(\d+)\s*seconds\))?\s*\n([\s\S]*?)(?=(?:##|#|$))/g,
    
    // Standard format with time ranges
    /(?:##|#)\s*(.*?)(?:\s*\((\d+)-(\d+)\s*seconds\))?\s*\n([\s\S]*?)(?=(?:##|#|$))/g,
    
    // Headers with just emojis (no time ranges)
    /(?:##|#)\s*([📝🧠🔍📚💡🚨✏️🔬📊]?\s*.*?)\n([\s\S]*?)(?=(?:##|#|$))/g
  ];
  
  // Try each pattern until we find matches
  for (const pattern of headerPatterns) {
    let match;
    let foundSections = false;
    const contentCopy = content.toString(); // Ensure we have a string
    
    while ((match = pattern.exec(contentCopy)) !== null) {
      foundSections = true;
      const title = match[1].trim();
      let startTime = parseInt(match[2], 10);
      let endTime = parseInt(match[3], 10);
      let sectionContent = match[4] || match[2]; // match[4] for time ranges, match[2] for emoji style
      
      // Clean up the title by removing the time range
      const cleanTitle = title.replace(/\(\d+-\d+\s*seconds\)/, '').trim();
      
      // Clean up the content
      if (sectionContent) {
        sectionContent = sectionContent.trim()
          .replace(/^\*+|\*+$/g, '') // Remove leading/trailing asterisks
          .trim();
      } else {
        sectionContent = ''; // Provide a default value
      }
      
      // For sections without explicit time ranges, assign based on position
      if (isNaN(startTime) || isNaN(endTime)) {
        const timeRanges = [
          [0, 20],    // Understanding/Introduction
          [20, 40],   // Structure/Main Points
          [40, 60],   // Analysis/Development
          [60, 80],   // Evidence/Examples
          [80, 100],  // Synthesis/Conclusion
          [100, 120]  // Final Points/Tips
        ];
        
        const sectionIndex = sections.length;
        [startTime, endTime] = timeRanges[Math.min(sectionIndex, timeRanges.length - 1)];
      }
      
      // Map section titles to icon names
      let icon = 'Circle'; // Default icon
      const lowerTitle = cleanTitle.toLowerCase();
      
      if (title.includes('📝') || lowerTitle.includes('understanding') || lowerTitle.includes('what it is')) icon = 'FileText';
      else if (title.includes('🧠') || lowerTitle.includes('structure')) icon = 'Brain';
      else if (title.includes('🔍') || lowerTitle.includes('analysis')) icon = 'Search';
      else if (title.includes('📚') || lowerTitle.includes('evidence')) icon = 'BookOpen';
      else if (title.includes('💡') || lowerTitle.includes('conclusion') || lowerTitle.includes('analogy')) icon = 'Lightbulb';
      else if (title.includes('🚨') || lowerTitle.includes('pitfall') || lowerTitle.includes('misconception')) icon = 'AlertTriangle';
      else if (title.includes('✏️') || lowerTitle.includes('checklist') || lowerTitle.includes('takeaway')) icon = 'CheckSquare';
      else if (title.includes('🔬') || lowerTitle.includes('specific')) icon = 'Microscope';
      else if (title.includes('📊') || lowerTitle.includes('time')) icon = 'Clock';
      else if (title.includes('🌅') || lowerTitle.includes('spark')) icon = 'Sunrise';
      else if (title.includes('🔑') || lowerTitle.includes('discovery')) icon = 'Key';
      else if (title.includes('🌈') || lowerTitle.includes('transformation')) icon = 'Rainbow';
      else if (title.includes('🌍') || lowerTitle.includes('parallel') || lowerTitle.includes('application')) icon = 'Globe';
      else if (title.includes('🧱') || lowerTitle.includes('foundation') || lowerTitle.includes('principles')) icon = 'Box';
      else if (title.includes('🏗️') || lowerTitle.includes('layer')) icon = 'Layers';
      else if (title.includes('❓') || lowerTitle.includes('question')) icon = 'HelpCircle';
      else if (title.includes('💭') || lowerTitle.includes('insight')) icon = 'MessageCircle';
      else if (title.includes('🌟') || lowerTitle.includes('benefit')) icon = 'Star';
      else if (title.includes('🚀') || lowerTitle.includes('step')) icon = 'Rocket';
      else if (title.includes('🔄') || lowerTitle.includes('related') || lowerTitle.includes('deeper') || lowerTitle.includes('learn more')) icon = 'RefreshCw';
      
      sections.push({
        title: cleanTitle,
        content: sectionContent,
        timeRange: [startTime, endTime],
        icon
      });
    }
    
    if (foundSections) break; // Stop if we found sections with this pattern
  }
  
  // If no sections were found with any pattern, try direct markdown header parsing
  if (sections.length === 0) {
    const parts = content.split(/(?=##?\s+[^#\n]+)/);
    
    parts.forEach((part, index) => {
      if (!part.trim()) return;
      
      // Extract title and time range
      const titleMatch = part.match(/##?\s+([^\n]+?)(?:\s*\((\d+)-(\d+)\s*seconds\))?\s*\n/);
      if (!titleMatch) return;
      
      const title = titleMatch[1].trim();
      let startTime = parseInt(titleMatch[2], 10);
      let endTime = parseInt(titleMatch[3], 10);
      
      // Get content after the header
      let sectionContent = part
        .replace(/##?\s+[^\n]+\n/, '') // Remove header
        .trim();
      
      // If no time range found in header, assign based on position
      if (isNaN(startTime) || isNaN(endTime)) {
        const timeRanges = [
          [0, 10],     // What It Is
          [10, 30],    // Everyday Analogy
          [30, 60],    // Core Principles
          [60, 90],    // Real-World Application
          [90, 110],   // Common Misconception
          [110, 120],  // Quick Takeaway
          [120, 130]   // Want to go deeper
        ];
        
        [startTime, endTime] = timeRanges[Math.min(index, timeRanges.length - 1)];
      }
      
      // Determine icon based on content
      let icon = 'Circle'; // Default icon
      const lowerTitle = title.toLowerCase();
      
      if (lowerTitle.includes('what it is')) icon = 'FileText';
      else if (lowerTitle.includes('analogy')) icon = 'Lightbulb';
      else if (lowerTitle.includes('principles')) icon = 'Layers';
      else if (lowerTitle.includes('application')) icon = 'Rocket';
      else if (lowerTitle.includes('misconception')) icon = 'AlertTriangle';
      else if (lowerTitle.includes('takeaway')) icon = 'CheckSquare';
      else if (lowerTitle.includes('deeper') || lowerTitle.includes('learn more')) icon = 'BookOpen';
      
      sections.push({
        title,
        content: sectionContent,
        timeRange: [startTime, endTime],
        icon
      });
    });
  }
  
  return sections;
}

export function extractRelatedConcepts(content: string): string[] {
  if (!content) {
    return [];
  }

  // Look for sections that might contain related concepts
  const sections = [
    'Related Concepts',
    'Want to go deeper',
    'Further Study',
    'To Learn More',
    'Learn More',
    'Related Topics',
    'See Also'
  ];
  
  // Create a pattern that matches any of these sections and their content
  const sectionPattern = new RegExp(
    `(?:${sections.join('|')}).*?\\n([\\s\\S]*?)(?=##|#|$)`,
    'i'
  );
  
  const match = content.match(sectionPattern);
  
  if (match) {
    // Extract bullet points or numbered items
    const items = match[1].match(/(?:[-*\d.]\s+|\*\*)(.*?)(?:\*\*|\n|$)/g);
    
    if (items) {
      return items
        .map(item => 
          item
            .replace(/^[-*\d.]\s+|\*\*/g, '')
            .replace(/\[|\]/g, '')
            .trim()
        )
        .filter(Boolean)
        .slice(0, 3); // Limit to 3 items
    }
  }
  
  // Fallback: look for numbered or bulleted lists anywhere in the content
  const listItems = content.match(/(?:^|\n)[-*\d.]\s+([^\n]+)/g);
  if (listItems) {
    return listItems
      .map(item => item.replace(/^[-*\d.]\s+/, '').trim())
      .filter(Boolean)
      .slice(0, 3);
  }
  
  return [];
}