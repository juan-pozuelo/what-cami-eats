'use client';

import { useState } from 'react';
import ingredientsData from './ingredients.json';

export default function Home() {
  const [ingredient, setIngredient] = useState('');
  const [result, setResult] = useState(null);

  // Levenshtein distance function for fuzzy matching
  function getLevenshteinDistance(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  // Fuzzy search to find closest matches, removing duplicates
  function getClosestMatches(input, data, maxDistance = 3) {
    const lowerInput = input.toLowerCase();
    const matches = data
      .map(item => ({
        name: item.name,
        dist: getLevenshteinDistance(lowerInput, item.name),
      }))
      .filter(item => item.dist <= maxDistance)
      .sort((a, b) => a.dist - b.dist)
      .map(item => item.name);

    // Remove duplicates while preserving order
    const uniqueMatches = [...new Set(matches)];

    return uniqueMatches.slice(0, 3);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const lower = ingredient.toLowerCase().trim();
    const found = ingredientsData.find(item => item.name === lower);

    if (found) {
      setResult({
        message: found.comment,
        health: found.health,
        sustainability: found.sustainability,
        emoji: found.emoji || '',
        unknown: false,
      });
    } else {
      // Get close matches for suggestions
      const suggestions = getClosestMatches(lower, ingredientsData);
      setResult({
        message: `🤷‍♀️ Hmm, no info on "${ingredient}" yet. Check the label and trust your gut!`,
        unknown: true,
        suggestions,
      });
    }
  };

  // Color coding for health and sustainability levels
  const colorByHealth = {
    good: '#3a7a2b',
    neutral: '#a97c50',
    caution: '#c1440e',
  };

  const colorBySustainability = {
    'low impact': '#3a7a2b',
    'medium impact': '#a97c50',
    'high impact': '#c1440e',
  };

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <h1 style={styles.title}>Is this ingredient Cami approved?✨ </h1>
        <p style={{ ...styles.subtitle, color: '#496b2d' }}>
          A quick vibe check on ingredients — sustainable, healthy, and nonna friendly.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="e.g. Papaya"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Check Ingredient
          </button>
        </form>

        {result && (
          <div
            style={{
              ...styles.resultBox,
              animation: 'fadeIn 0.5s ease',
            }}
          >
            <p style={styles.resultMessage}>
              {result.emoji ? `${result.emoji} ${result.message}` : result.message}
            </p>

            {!result.unknown && (
              <>
                <p
                  style={{
                    ...styles.label,
                    color: colorByHealth[result.health] || '#496b2d',
                  }}
                >
                  Healthy Level: <strong>{result.health}</strong>
                </p>
                <p
                  style={{
                    ...styles.label,
                    color: colorBySustainability[result.sustainability] || '#496b2d',
                  }}
                >
                  Sustainability: <strong>{result.sustainability}</strong>
                </p>
              </>
            )}

            {result.unknown && result.suggestions && result.suggestions.length > 0 && (
              <p style={{ ...styles.suggestions, color: '#c1440e' }}>
                Did you mean: {result.suggestions.join(', ')}?
              </p>
            )}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}

const styles = {
  main: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#fdf6f0',
    minHeight: '100vh',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '16px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.04)',
    border: '1px solid #eee',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#3b3028',
    marginBottom: '0.5rem',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '0.95rem',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.9rem 1rem',
    fontSize: '1rem',
    borderRadius: '12px',
    border: '1px solid #ddd',
    outlineColor: '#c1440e',
    backgroundColor: '#fffdfb',
    color: '#3b3028',
  },
  button: {
    backgroundColor: '#c1440e',
    color: '#fff',
    fontWeight: '500',
    fontSize: '1rem',
    padding: '0.9rem',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  resultBox: {
    marginTop: '2rem',
    padding: '1.25rem',
    borderRadius: '14px',
    border: '1.5px solid #eee',
    backgroundColor: '#f7f3ed',
  },
  resultMessage: {
    fontSize: '1rem',
    color: '#3b3028',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: '600',
    textAlign: 'center',
    margin: '0.25rem 0',
  },
  suggestions: {
    fontSize: '0.9rem',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: '1rem',
  },
};
