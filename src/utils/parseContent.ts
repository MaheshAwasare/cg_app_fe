import { ConceptSection } from '../types';

export function parseConceptContent(content: string): ConceptSection[] {
  const sections: ConceptSection[] = [];
  
  // Regular expressions to match different header styles
  const headerPatterns = [
    // Headers with emojis and time ranges
    /(?:##|#)\s*([🌅🔑🌈🌍💡🧱🏗️🧩🔍🚀❓💭🌟📝🧠🔬📚💡🚨✏️]\s*.*?)(?:\s*\((\d+)-(\d+)\s*seconds\))?\s*\n([\s\S]*?)(?=(?:##|#|$))/g,
    
    // Standard format with time ranges
    /(?:##|\*\*)\s*(.*?)(?:\s*\((\d+)-(\d+)\s*seconds\))?\s*(?:\*\*)?\n([\s\S]*?)(?=(?:##|\*\*|$))/g,
    
    // Headers with just emojis (no time ranges)
    /(?:##|#)\s*([📝🧠🔍📚💡🚨✏️🔬📊]?\s*.*?)\n([\s\S]*?)(?=(?:##|#|$))/g
  ];
  
  // Try each pattern until we find matches
  for (const pattern of headerPatterns) {
    let match;
    let foundSections = false;
    
    while ((match = pattern.exec(content)) !== null) {
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
      
      // Assign icons based on section titles and content
      let icon = '';
      const lowerTitle = cleanTitle.toLowerCase();
      
      // Enhanced icon mapping
      if (title.includes('📝') || lowerTitle.includes('understanding')) icon = 'FileText';
      else if (title.includes('🧠') || lowerTitle.includes('structure')) icon = 'Brain';
      else if (title.includes('🔍') || lowerTitle.includes('analysis')) icon = 'Search';
      else if (title.includes('📚') || lowerTitle.includes('evidence')) icon = 'BookOpen';
      else if (title.includes('💡') || lowerTitle.includes('conclusion')) icon = 'Lightbulb';
      else if (title.includes('🚨') || lowerTitle.includes('pitfall')) icon = 'AlertTriangle';
      else if (title.includes('✏️') || lowerTitle.includes('checklist')) icon = 'CheckSquare';
      else if (title.includes('🔬') || lowerTitle.includes('specific')) icon = 'Microscope';
      else if (title.includes('📊') || lowerTitle.includes('time')) icon = 'Clock';
      else if (title.includes('🌅') || lowerTitle.includes('spark')) icon = 'Sunrise';
      else if (title.includes('🔑') || lowerTitle.includes('discovery')) icon = 'Key';
      else if (title.includes('🌈') || lowerTitle.includes('transformation')) icon = 'Rainbow';
      else if (title.includes('🌍') || lowerTitle.includes('parallel')) icon = 'Globe';
      else if (title.includes('🧱') || lowerTitle.includes('foundation')) icon = 'Box';
      else if (title.includes('🏗️') || lowerTitle.includes('layer')) icon = 'Layers';
      else if (title.includes('🧩') || lowerTitle.includes('connecting')) icon = 'PuzzlePiece';
      else if (title.includes('❓') || lowerTitle.includes('question')) icon = 'HelpCircle';
      else if (title.includes('💭') || lowerTitle.includes('insight')) icon = 'MessageCircle';
      else if (title.includes('🌟') || lowerTitle.includes('benefit')) icon = 'Star';
      else if (title.includes('🚀') || lowerTitle.includes('step')) icon = 'Rocket';
      else if (title.includes('🔄') || lowerTitle.includes('related')) icon = 'RefreshCw';
      // Default icon if no match
      else icon = 'Circle';
      
      sections.push({
        title: cleanTitle,
        content: sectionContent,
        timeRange: [startTime, endTime],
        icon
      });
    }
    
    if (foundSections) break; // Stop if we found sections with this pattern
  }
  
  // If no sections were found with any pattern, create a default structure
  if (sections.length === 0) {
    const defaultTimeRanges: [number, number][] = [
      [0, 30],     // First section
      [30, 60],    // Second section
      [60, 90],    // Third section
      [90, 110],   // Fourth section
      [110, 120],  // Fifth section
    ];
    
    // Split content by markdown headers
    const parts = content.split(/(?=(?:##|#|\*\*))/);
    
    parts.forEach((part, index) => {
      if (!part.trim()) return;
      
      // Extract title and content
      const titleMatch = part.match(/(?:##|#|\*\*)\s*(.*?)(?:\*\*|\n)/);
      const title = titleMatch ? titleMatch[1].trim() : `Section ${index + 1}`;
      
      // Clean up content
      const content = part
        .replace(/(?:##|#|\*\*)\s*(.*?)(?:\*\*|\n)/, '')
        .trim()
        .replace(/^\*+|\*+$/g, '')
        .trim();
      
      if (content) {
        // Assign time range
        const timeRange = index < defaultTimeRanges.length 
          ? defaultTimeRanges[index] 
          : [defaultTimeRanges[defaultTimeRanges.length - 1][1], defaultTimeRanges[defaultTimeRanges.length - 1][1] + 10];
        
        // Determine icon based on content
        let icon = '';
        const lowerContent = content.toLowerCase();
        
        if (lowerContent.includes('understanding')) icon = 'FileText';
        else if (lowerContent.includes('structure')) icon = 'Brain';
        else if (lowerContent.includes('analysis')) icon = 'Search';
        else if (lowerContent.includes('evidence')) icon = 'BookOpen';
        else if (lowerContent.includes('conclusion')) icon = 'Lightbulb';
        else if (lowerContent.includes('pitfall')) icon = 'AlertTriangle';
        else if (lowerContent.includes('checklist')) icon = 'CheckSquare';
        else if (lowerContent.includes('specific')) icon = 'Microscope';
        else if (lowerContent.includes('time')) icon = 'Clock';
        else if (index === 0) icon = 'FileText';
        else if (index === sections.length - 1) icon = 'CheckSquare';
        else icon = 'Circle';
        
        sections.push({
          title,
          content,
          timeRange,
          icon
        });
      }
    });
  }
  
  return sections;
}

export function extractRelatedConcepts(content: string): string[] {
  // Look for sections that might contain related concepts
  const sections = [
    'Related Concepts',
    'Related Academic Concepts',
    'Adjacent Building Blocks',
    'Related Questions',
    'Want to go deeper?',
    'Further Study',
    'Further Exploration',
    'To Learn More',
    'Where to Learn More',
    'Recommended Reading',
    'See Also'
  ];
  
  // Create a pattern that matches any of these sections
  const sectionPattern = new RegExp(
    `(?:${sections.join('|')})([\\s\\S]*?)(?=##|#|\\*\\*|$)`,
    'i'
  );
  
  const match = content.match(sectionPattern);
  
  if (match) {
    // Extract bullet points, numbered items, or bold text items
    const items = match[1].match(/(?:[-*\d.]\s+|\*\*)(.*?)(?:\*\*|\n|$)/g);
    
    if (items) {
      return items
        .map(item => 
          item
            .replace(/[-*\d.]\s+|\*\*/g, '')
            .replace(/\[|\]/g, '')
            .trim()
        )
        .filter(Boolean)
        .slice(0, 3); // Limit to 3 items
    }
  }
  
  // Fallback: extract any capitalized phrases that might be concepts
  const conceptMatches = content.match(/\b[A-Z][a-zA-Z\s]{2,}\b/g);
  return conceptMatches 
    ? [...new Set(conceptMatches)].slice(0, 3) 
    : [];
}