/**
 * SM-2 Spaced Repetition Algorithm Helper
 */
function calculateNextReview(confidence, currentInterval = 1, currentEase = 2.5, currentReviewCount = 0) {
  let grade;
  switch (confidence) {
    case 'High':
      grade = 5;
      break;
    case 'Medium':
      grade = 3;
      break;
    case 'Low':
    default:
      grade = 1;
      break;
  }

  let interval = currentInterval;
  let easeFactor = currentEase;
  let reviewCount = currentReviewCount;

  if (grade >= 3) {
    if (reviewCount === 0) {
      interval = 1;
    } else if (reviewCount === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    reviewCount += 1;
  } else {
    reviewCount = 0;
    interval = 1;
  }

  // SM-2 Ease Factor formula
  easeFactor = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  // Determine status
  let status = 'Practiced';
  if (reviewCount >= 3 && confidence === 'High' && interval >= 14) {
    status = 'Mastered';
  }

  return {
    nextReview: nextReviewDate,
    interval,
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    reviewCount,
    status
  };
}

module.exports = { calculateNextReview };
