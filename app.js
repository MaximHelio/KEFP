const NLP = require('natural');
const fs = require('fs');

function readPaper(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function extractKeywords(text) {
  const tokenizer = new NLP.WordTokenizer();
  const tokens = tokenizer.tokenize(text);

  const stopWords = new Set(NLP.stopwords);
  const filteredTokens = tokens.filter(token => !stopWords.has(token.toLowerCase()));

  const frequency = {};
  filteredTokens.forEach(token => {
    frequency[token] = (frequency[token] || 0) + 1;
  });

  const sortedKeywords = Object.keys(frequency).sort((a, b) => frequency[b] - frequency[a]);
  const topKeywords = sortedKeywords.slice(0, 5);

  return topKeywords;
}

function generateSummary(text, keywords) {
  const sentences = text.split(/[.!?]/);
  const summarySentences = sentences.filter(sentence => {
    const sentenceTokens = new NLP.WordTokenizer().tokenize(sentence);
    const intersection = sentenceTokens.filter(token => keywords.includes(token));
    return intersection.length > 0;
  });

  return summarySentences.join(' ');
}

const paperFilePath = './paper.txt';

const paperText = readPaper(paperFilePath);

const keywords = extractKeywords(paperText);
console.log('keywords:', keywords);

const summary = generateSummary(paperText, keywords);

// console.log('Summary:', summary);
