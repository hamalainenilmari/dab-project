export const levenshteinDistance = (str1, str2) => {
    const matrix = [];

    // Create a matrix of size (str1.length + 1) x (str2.length + 1)
    for (let i = 0; i <= str1.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 1; j <= str2.length; j++) {
        matrix[0][j] = j;
    }

    // Populate the matrix
    for (let i = 1; i <= str1.length; i++) {
        for (let j = 1; j <= str2.length; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1]; // No operation needed
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // Substitution
                    matrix[i][j - 1] + 1,     // Deletion
                    matrix[i - 1][j] + 1      // Insertion
                );
            }
        }
    }

    return matrix[str1.length][str2.length];
}
