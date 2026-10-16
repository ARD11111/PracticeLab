// Canonical 150 PracticeLab Dataset with 18 Categories, Primary Patterns, Secondary Patterns, Data Structures & Learning Roadmap Metadata

const canonicalCategories = [
  { name: 'Arrays & Hashing', order: 1, section: 'FOUNDATION', prerequisites: [] },
  { name: 'Two Pointers', order: 2, section: 'FOUNDATION', prerequisites: ['Arrays & Hashing'] },
  { name: 'Sliding Window', order: 3, section: 'FOUNDATION', prerequisites: ['Two Pointers'] },
  { name: 'Stack', order: 4, section: 'FOUNDATION', prerequisites: ['Arrays & Hashing'] },
  { name: 'Binary Search', order: 5, section: 'FOUNDATION', prerequisites: ['Arrays & Hashing'] },

  { name: 'Linked List', order: 6, section: 'CORE DATA STRUCTURES', prerequisites: ['Two Pointers'] },
  { name: 'Trees', order: 7, section: 'CORE DATA STRUCTURES', prerequisites: ['Stack'] },
  { name: 'Heap / Priority Queue', order: 8, section: 'CORE DATA STRUCTURES', prerequisites: ['Trees'] },
  { name: 'Intervals', order: 9, section: 'CORE DATA STRUCTURES', prerequisites: ['Arrays & Hashing'] },
  { name: 'Greedy', order: 10, section: 'CORE DATA STRUCTURES', prerequisites: ['Arrays & Hashing'] },

  { name: 'Backtracking', order: 11, section: 'RECURSION / SEARCH', prerequisites: ['Trees'] },
  { name: 'Tries', order: 12, section: 'RECURSION / SEARCH', prerequisites: ['Trees'] },

  { name: 'Graphs', order: 13, section: 'GRAPH FUNDAMENTALS', prerequisites: ['Trees'] },
  { name: 'Advanced Graphs', order: 14, section: 'ADVANCED GRAPH ALGORITHMS', prerequisites: ['Graphs'] },

  { name: '1-D Dynamic Programming', order: 15, section: 'DYNAMIC PROGRAMMING', prerequisites: ['Backtracking'] },
  { name: '2-D Dynamic Programming', order: 16, section: 'DYNAMIC PROGRAMMING', prerequisites: ['1-D Dynamic Programming'] },

  { name: 'Bit Manipulation', order: 17, section: 'SPECIALIZED / ADVANCED TECHNIQUES', prerequisites: ['Arrays & Hashing'] },
  { name: 'Math & Geometry', order: 18, section: 'SPECIALIZED / ADVANCED TECHNIQUES', prerequisites: ['Arrays & Hashing'] }
];

const canonicalPatterns = [
  // Arrays & Hashing
  { name: 'Hash Map / Hash Set', slug: 'hash-map-hash-set', category: 'Arrays & Hashing', categoryOrder: 1, learningOrder: 1, section: 'FOUNDATION', description: 'Using hash tables for O(1) lookups and frequency counting.' },
  { name: 'Prefix Sum', slug: 'prefix-sum', category: 'Arrays & Hashing', categoryOrder: 1, learningOrder: 2, section: 'FOUNDATION', description: 'Precomputing cumulative sums for O(1) range query evaluations.' },
  { name: 'Sorting', slug: 'sorting', category: 'Arrays & Hashing', categoryOrder: 1, learningOrder: 3, section: 'FOUNDATION', description: 'Arranging elements to enable efficient searching or two-pointer traversals.' },
  { name: 'String Encoding / Parsing', slug: 'string-encoding-parsing', category: 'Arrays & Hashing', categoryOrder: 1, learningOrder: 4, section: 'FOUNDATION', description: 'Serializing, deserializing, or parsing formatted strings.' },
  { name: 'Top K Elements', slug: 'top-k-elements', category: 'Arrays & Hashing', categoryOrder: 1, learningOrder: 5, section: 'FOUNDATION', description: 'Using heaps or quickselect to find top K largest or frequent elements.' },

  // Two Pointers
  { name: 'Two Pointers', slug: 'two-pointers', category: 'Two Pointers', categoryOrder: 2, learningOrder: 1, section: 'FOUNDATION', description: 'Iterating with two pointers from ends or directions to solve array/string problems.' },
  { name: 'Fast & Slow Pointers', slug: 'fast-slow-pointers', category: 'Two Pointers', categoryOrder: 2, learningOrder: 2, section: 'FOUNDATION', description: 'Two pointers moving at different speeds for cycle detection and midpoints.' },

  // Sliding Window
  { name: 'Sliding Window', slug: 'sliding-window', category: 'Sliding Window', categoryOrder: 3, learningOrder: 1, section: 'FOUNDATION', description: 'Maintaining a dynamic contiguous subarray or substring window.' },
  { name: 'Monotonic Deque', slug: 'monotonic-deque', category: 'Sliding Window', categoryOrder: 3, learningOrder: 2, section: 'FOUNDATION', description: 'Double-ended queue storing monotonic elements for sliding window max/min.' },

  // Stack
  { name: 'Stack', slug: 'stack', category: 'Stack', categoryOrder: 4, learningOrder: 1, section: 'FOUNDATION', description: 'LIFO evaluation for nested structures, expression evaluation, or matching.' },
  { name: 'Monotonic Stack', slug: 'monotonic-stack', category: 'Stack', categoryOrder: 4, learningOrder: 2, section: 'FOUNDATION', description: 'Maintaining elements in monotonic increasing/decreasing order inside a stack.' },

  // Binary Search
  { name: 'Binary Search', slug: 'binary-search', category: 'Binary Search', categoryOrder: 5, learningOrder: 1, section: 'FOUNDATION', description: 'Dividing search space in half on sorted collections.' },
  { name: 'Binary Search on Answer', slug: 'binary-search-on-answer', category: 'Binary Search', categoryOrder: 5, learningOrder: 2, section: 'FOUNDATION', description: 'Binary searching over a monotonic answer space.' },

  // Linked List
  { name: 'Linked List Traversal', slug: 'linked-list-traversal', category: 'Linked List', categoryOrder: 6, learningOrder: 1, section: 'CORE DATA STRUCTURES', description: 'Traversing nodes with pointers and carry states.' },
  { name: 'Linked List Reversal', slug: 'linked-list-reversal', category: 'Linked List', categoryOrder: 6, learningOrder: 2, section: 'CORE DATA STRUCTURES', description: 'Inverting pointers of linked lists in-place.' },
  { name: 'Cycle Detection', slug: 'cycle-detection', category: 'Linked List', categoryOrder: 6, learningOrder: 3, section: 'CORE DATA STRUCTURES', description: 'Identifying cycles in graphs or pointers.' },
  { name: 'K-way Merge', slug: 'k-way-merge', category: 'Linked List', categoryOrder: 6, learningOrder: 4, section: 'CORE DATA STRUCTURES', description: 'Merging K sorted arrays or lists using heaps or divide & conquer.' },

  // Trees
  { name: 'Tree DFS', slug: 'tree-dfs', category: 'Trees', categoryOrder: 7, learningOrder: 1, section: 'CORE DATA STRUCTURES', description: 'Depth-first traversal over binary trees (preorder, inorder, postorder).' },
  { name: 'Tree BFS', slug: 'tree-bfs', category: 'Trees', categoryOrder: 7, learningOrder: 2, section: 'CORE DATA STRUCTURES', description: 'Breadth-first level-order traversal over binary trees.' },
  { name: 'Binary Search Tree', slug: 'binary-search-tree', category: 'Trees', categoryOrder: 7, learningOrder: 3, section: 'CORE DATA STRUCTURES', description: 'Exploiting left < node < right ordering of BSTs.' },
  { name: 'Divide and Conquer', slug: 'divide-and-conquer', category: 'Trees', categoryOrder: 7, learningOrder: 4, section: 'CORE DATA STRUCTURES', description: 'Breaking problems into subproblems, solving recursively, and combining.' },
  { name: 'Tree DP', slug: 'tree-dp', category: 'Trees', categoryOrder: 7, learningOrder: 5, section: 'CORE DATA STRUCTURES', description: 'Dynamic programming on trees aggregating subtree results.' },

  // Heap / Priority Queue
  { name: 'Heap', slug: 'heap', category: 'Heap / Priority Queue', categoryOrder: 8, learningOrder: 1, section: 'CORE DATA STRUCTURES', description: 'Priority queue retrieval for max or min values.' },
  { name: 'Two Heaps', slug: 'two-heaps', category: 'Heap / Priority Queue', categoryOrder: 8, learningOrder: 2, section: 'CORE DATA STRUCTURES', description: 'Maintaining max-heap and min-heap for continuous median tracking.' },

  // Intervals
  { name: 'Intervals', slug: 'intervals', category: 'Intervals', categoryOrder: 9, learningOrder: 1, section: 'CORE DATA STRUCTURES', description: 'Sorting and merging overlapping or disjoint interval ranges.' },
  { name: 'Heap + Sorting', slug: 'heap-sorting', category: 'Intervals', categoryOrder: 9, learningOrder: 2, section: 'CORE DATA STRUCTURES', description: 'Combining sorting with priority queues for dynamic interval processing.' },

  // Greedy
  { name: 'Greedy', slug: 'greedy', category: 'Greedy', categoryOrder: 10, learningOrder: 1, section: 'CORE DATA STRUCTURES', description: 'Making locally optimal choices to achieve globally optimal solutions.' },
  { name: 'Kadane\'s Algorithm', slug: 'kadanes-algorithm', category: 'Greedy', categoryOrder: 10, learningOrder: 2, section: 'CORE DATA STRUCTURES', description: 'Maximum contiguous subarray sum evaluation in linear time.' },
  { name: 'Range Tracking', slug: 'range-tracking', category: 'Greedy', categoryOrder: 10, learningOrder: 3, section: 'CORE DATA STRUCTURES', description: 'Tracking lower and upper bound ranges dynamically.' },

  // Backtracking
  { name: 'Backtracking', slug: 'backtracking', category: 'Backtracking', categoryOrder: 11, learningOrder: 1, section: 'RECURSION / SEARCH', description: 'Recursively building candidates and pruning invalid search paths.' },

  // Tries
  { name: 'Trie', slug: 'trie', category: 'Tries', categoryOrder: 12, learningOrder: 1, section: 'RECURSION / SEARCH', description: 'Prefix tree traversal and fast string retrieval.' },
  { name: 'Trie + Backtracking', slug: 'trie-backtracking', category: 'Tries', categoryOrder: 12, learningOrder: 2, section: 'RECURSION / SEARCH', description: 'Combining prefix trees with DFS backtracking for word searches.' },

  // Graphs
  { name: 'DFS', slug: 'dfs', category: 'Graphs', categoryOrder: 13, learningOrder: 1, section: 'GRAPH FUNDAMENTALS', description: 'Depth-first search for connectivity, pathfinding, and components.' },
  { name: 'BFS', slug: 'bfs', category: 'Graphs', categoryOrder: 13, learningOrder: 2, section: 'GRAPH FUNDAMENTALS', description: 'Breadth-first search for shortest unweighted paths and level exploration.' },
  { name: 'Matrix Traversal', slug: 'matrix-traversal', category: 'Graphs', categoryOrder: 13, learningOrder: 3, section: 'GRAPH FUNDAMENTALS', description: 'Navigating 2D grid dimensions with directional offsets.' },
  { name: 'Multi-source BFS', slug: 'multi-source-bfs', category: 'Graphs', categoryOrder: 13, learningOrder: 4, section: 'GRAPH FUNDAMENTALS', description: 'Simultaneous BFS starting from multiple starting locations.' },
  { name: 'Topological Sort', slug: 'topological-sort', category: 'Graphs', categoryOrder: 13, learningOrder: 5, section: 'GRAPH FUNDAMENTALS', description: 'Ordering directed acyclic graphs via indegrees or post-order DFS.' },
  { name: 'Union-Find / DSU', slug: 'union-find-dsu', category: 'Graphs', categoryOrder: 13, learningOrder: 6, section: 'GRAPH FUNDAMENTALS', description: 'Disjoint Set Union with path compression and rank optimization.' },

  // Advanced Graphs
  { name: 'Minimum Spanning Tree', slug: 'minimum-spanning-tree', category: 'Advanced Graphs', categoryOrder: 14, learningOrder: 1, section: 'ADVANCED GRAPH ALGORITHMS', description: 'Connecting graph nodes with minimum total edge weight (Kruskal / Prim).' },
  { name: 'Shortest Path', slug: 'shortest-path', category: 'Advanced Graphs', categoryOrder: 14, learningOrder: 2, section: 'ADVANCED GRAPH ALGORITHMS', description: 'Finding optimal paths in weighted graphs (Bellman-Ford, Floyd-Warshall, etc).' },
  { name: 'Dijkstra', slug: 'dijkstra', category: 'Advanced Graphs', categoryOrder: 14, learningOrder: 3, section: 'ADVANCED GRAPH ALGORITHMS', description: 'Greedy shortest path using priority queues for non-negative weighted graphs.' },
  { name: 'Eulerian Path', slug: 'eulerian-path', category: 'Advanced Graphs', categoryOrder: 14, learningOrder: 4, section: 'ADVANCED GRAPH ALGORITHMS', description: 'Traversing graph edges exactly once using Hierholzer algorithm.' },

  // 1-D Dynamic Programming
  { name: 'Dynamic Programming', slug: 'dynamic-programming', category: '1-D Dynamic Programming', categoryOrder: 15, learningOrder: 1, section: 'DYNAMIC PROGRAMMING', description: 'Overlapping subproblems and optimal substructure evaluation.' },
  { name: 'Expand Around Center', slug: 'expand-around-center', category: '1-D Dynamic Programming', categoryOrder: 15, learningOrder: 2, section: 'DYNAMIC PROGRAMMING', description: 'Expanding outward from center indices to find palindromes.' },
  { name: '0/1 Knapsack', slug: '0-1-knapsack', category: '1-D Dynamic Programming', categoryOrder: 15, learningOrder: 3, section: 'DYNAMIC PROGRAMMING', description: 'Subset optimization with item inclusion or exclusion choices.' },

  // 2-D Dynamic Programming
  { name: '2-D Dynamic Programming', slug: '2-d-dynamic-programming', category: '2-D Dynamic Programming', categoryOrder: 16, learningOrder: 1, section: 'DYNAMIC PROGRAMMING', description: '2D grid states and string alignment DP state transitions.' },

  // Bit Manipulation
  { name: 'Bit Manipulation', slug: 'bit-manipulation', category: 'Bit Manipulation', categoryOrder: 17, learningOrder: 1, section: 'SPECIALIZED / ADVANCED TECHNIQUES', description: 'Bitwise XOR, AND, OR, and bit shifts for optimization.' },

  // Math & Geometry
  { name: 'Matrix Manipulation', slug: 'matrix-manipulation', category: 'Math & Geometry', categoryOrder: 18, learningOrder: 1, section: 'SPECIALIZED / ADVANCED TECHNIQUES', description: 'In-place matrix rotations, transpositions, and zero-setting.' },
  { name: 'Math / Digit Manipulation', slug: 'math-digit-manipulation', category: 'Math & Geometry', categoryOrder: 18, learningOrder: 2, section: 'SPECIALIZED / ADVANCED TECHNIQUES', description: 'Arithmetic, modulo arithmetic, digit extraction, and power algorithms.' }
];


const canonicalProblems = [
  // ARRAYS & HASHING
  {
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    primaryPattern: 'Hash Map / Hash Set',
    secondaryPatterns: [],
    dataStructures: ['Hash Set'],
    url: 'https://leetcode.com/problems/contains-duplicate/'
  },
  {
    title: 'Valid Anagram',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    primaryPattern: 'Hash Map / Hash Set',
    secondaryPatterns: [],
    dataStructures: ['Hash Map'],
    url: 'https://leetcode.com/problems/valid-anagram/'
  },
  {
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    primaryPattern: 'Hash Map / Hash Set',
    secondaryPatterns: [],
    dataStructures: ['Hash Map'],
    url: 'https://leetcode.com/problems/two-sum/'
  },
  {
    title: 'Group Anagrams',
    difficulty: 'Medium',
    category: 'Arrays & Hashing',
    primaryPattern: 'Hash Map / Hash Set',
    secondaryPatterns: ['Sorting'],
    dataStructures: ['Hash Map'],
    url: 'https://leetcode.com/problems/group-anagrams/'
  },
  {
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    category: 'Arrays & Hashing',
    primaryPattern: 'Top K Elements',
    secondaryPatterns: ['Hash Map / Hash Set', 'Heap'],
    dataStructures: ['Hash Map', 'Heap'],
    url: 'https://leetcode.com/problems/top-k-frequent-elements/'
  },
  {
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    category: 'Arrays & Hashing',
    primaryPattern: 'Prefix Sum',
    secondaryPatterns: [],
    dataStructures: ['Array'],
    url: 'https://leetcode.com/problems/product-of-array-except-self/'
  },
  {
    title: 'Valid Sudoku',
    difficulty: 'Medium',
    category: 'Arrays & Hashing',
    primaryPattern: 'Hash Map / Hash Set',
    secondaryPatterns: [],
    dataStructures: ['Hash Set'],
    url: 'https://leetcode.com/problems/valid-sudoku/'
  },
  {
    title: 'Encode and Decode Strings',
    difficulty: 'Medium',
    category: 'Arrays & Hashing',
    primaryPattern: 'String Encoding / Parsing',
    secondaryPatterns: [],
    dataStructures: ['Array', 'String'],
    url: 'https://leetcode.com/problems/encode-and-decode-strings/'
  },
  {
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    category: 'Arrays & Hashing',
    primaryPattern: 'Hash Map / Hash Set',
    secondaryPatterns: [],
    dataStructures: ['Hash Set'],
    url: 'https://leetcode.com/problems/longest-consecutive-sequence/'
  },

  // TWO POINTERS
  {
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    category: 'Two Pointers',
    primaryPattern: 'Two Pointers',
    secondaryPatterns: [],
    dataStructures: ['Array/String'],
    url: 'https://leetcode.com/problems/valid-palindrome/'
  },
  {
    title: 'Two Sum II - Input Array Is Sorted',
    difficulty: 'Medium',
    category: 'Two Pointers',
    primaryPattern: 'Two Pointers',
    secondaryPatterns: [],
    dataStructures: ['Array'],
    url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/'
  },
  {
    title: '3Sum',
    difficulty: 'Medium',
    category: 'Two Pointers',
    primaryPattern: 'Two Pointers',
    secondaryPatterns: ['Sorting'],
    dataStructures: ['Array'],
    url: 'https://leetcode.com/problems/3sum/'
  },
  {
    title: 'Container With Most Water',
    difficulty: 'Medium',
    category: 'Two Pointers',
    primaryPattern: 'Two Pointers',
    secondaryPatterns: [],
    dataStructures: ['Array'],
    url: 'https://leetcode.com/problems/container-with-most-water/'
  },
  {
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    category: 'Two Pointers',
    primaryPattern: 'Two Pointers',
    secondaryPatterns: ['Prefix Sum'],
    dataStructures: ['Array'],
    url: 'https://leetcode.com/problems/trapping-rain-water/'
  },

  // SLIDING WINDOW
  {
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Sliding Window',
    primaryPattern: 'Sliding Window',
    secondaryPatterns: [],
    dataStructures: ['Array'],
    url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    primaryPattern: 'Sliding Window',
    secondaryPatterns: ['Hash Map / Hash Set'],
    dataStructures: ['Hash Set'],
    url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/'
  },
  {
    title: 'Longest Repeating Character Replacement',
    difficulty: 'Medium',
    category: 'Sliding Window',
    primaryPattern: 'Sliding Window',
    secondaryPatterns: ['Hash Map / Hash Set'],
    dataStructures: ['Hash Map'],
    url: 'https://leetcode.com/problems/longest-repeating-character-replacement/'
  },
  {
    title: 'Permutation in String',
    difficulty: 'Medium',
    category: 'Sliding Window',
    primaryPattern: 'Sliding Window',
    secondaryPatterns: ['Hash Map / Hash Set'],
    dataStructures: ['Hash Map'],
    url: 'https://leetcode.com/problems/permutation-in-string/'
  },
  {
    title: 'Minimum Window Substring',
    difficulty: 'Hard',
    category: 'Sliding Window',
    primaryPattern: 'Sliding Window',
    secondaryPatterns: ['Hash Map / Hash Set'],
    dataStructures: ['Hash Map'],
    url: 'https://leetcode.com/problems/minimum-window-substring/'
  },
  {
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    category: 'Sliding Window',
    primaryPattern: 'Monotonic Deque',
    secondaryPatterns: ['Sliding Window'],
    dataStructures: ['Deque'],
    url: 'https://leetcode.com/problems/sliding-window-maximum/'
  },

  // STACK
  {
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    primaryPattern: 'Stack',
    secondaryPatterns: [],
    dataStructures: ['Stack'],
    url: 'https://leetcode.com/problems/valid-parentheses/'
  },
  {
    title: 'Min Stack',
    difficulty: 'Medium',
    category: 'Stack',
    primaryPattern: 'Stack',
    secondaryPatterns: [],
    dataStructures: ['Stack'],
    url: 'https://leetcode.com/problems/min-stack/'
  },
  {
    title: 'Evaluate Reverse Polish Notation',
    difficulty: 'Medium',
    category: 'Stack',
    primaryPattern: 'Stack',
    secondaryPatterns: [],
    dataStructures: ['Stack'],
    url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/'
  },
  {
    title: 'Generate Parentheses',
    difficulty: 'Medium',
    category: 'Stack',
    primaryPattern: 'Backtracking',
    secondaryPatterns: ['Stack'],
    dataStructures: ['Stack'],
    url: 'https://leetcode.com/problems/generate-parentheses/'
  },
  {
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    category: 'Stack',
    primaryPattern: 'Monotonic Stack',
    secondaryPatterns: [],
    dataStructures: ['Stack'],
    url: 'https://leetcode.com/problems/daily-temperatures/'
  },
  {
    title: 'Car Fleet',
    difficulty: 'Medium',
    category: 'Stack',
    primaryPattern: 'Monotonic Stack',
    secondaryPatterns: ['Sorting'],
    dataStructures: ['Stack'],
    url: 'https://leetcode.com/problems/car-fleet/'
  },
  {
    title: 'Largest Rectangle in Histogram',
    difficulty: 'Hard',
    category: 'Stack',
    primaryPattern: 'Monotonic Stack',
    secondaryPatterns: [],
    dataStructures: ['Stack'],
    url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/'
  },

  // BINARY SEARCH
  {
    title: 'Binary Search',
    difficulty: 'Easy',
    category: 'Binary Search',
    primaryPattern: 'Binary Search',
    secondaryPatterns: [],
    dataStructures: ['Array'],
    url: 'https://leetcode.com/problems/binary-search/'
  },
  {
    title: 'Search a 2D Matrix',
    difficulty: 'Medium',
    category: 'Binary Search',
    primaryPattern: 'Binary Search',
    secondaryPatterns: ['Matrix Traversal'],
    dataStructures: ['Matrix'],
    url: 'https://leetcode.com/problems/search-a-2d-matrix/'
  },
  {
    title: 'Koko Eating Bananas',
    difficulty: 'Medium',
    category: 'Binary Search',
    primaryPattern: 'Binary Search on Answer',
    secondaryPatterns: [],
    dataStructures: ['Array'],
    url: 'https://leetcode.com/problems/koko-eating-bananas/'
  },
  {
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'Medium',
    category: 'Binary Search',
    primaryPattern: 'Binary Search',
    secondaryPatterns: [],
    dataStructures: ['Array'],
    url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/'
  },
  {
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    category: 'Binary Search',
    primaryPattern: 'Binary Search',
    secondaryPatterns: [],
    dataStructures: ['Array'],
    url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/'
  },
  {
    title: 'Time Based Key-Value Store',
    difficulty: 'Medium',
    category: 'Binary Search',
    primaryPattern: 'Binary Search',
    secondaryPatterns: ['Hash Map / Hash Set'],
    dataStructures: ['Hash Map', 'Array'],
    url: 'https://leetcode.com/problems/time-based-key-value-store/'
  },
  {
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    category: 'Binary Search',
    primaryPattern: 'Binary Search',
    secondaryPatterns: [],
    dataStructures: ['Array'],
    url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/'
  },

  // LINKED LIST
  {
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    category: 'Linked List',
    primaryPattern: 'Linked List Reversal',
    secondaryPatterns: [],
    dataStructures: ['Linked List'],
    url: 'https://leetcode.com/problems/reverse-linked-list/'
  },
  {
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    category: 'Linked List',
    primaryPattern: 'Two Pointers',
    secondaryPatterns: [],
    dataStructures: ['Linked List'],
    url: 'https://leetcode.com/problems/merge-two-sorted-lists/'
  },
  {
    title: 'Reorder List',
    difficulty: 'Medium',
    category: 'Linked List',
    primaryPattern: 'Fast & Slow Pointers',
    secondaryPatterns: ['Linked List Reversal', 'Two Pointers'],
    dataStructures: ['Linked List'],
    url: 'https://leetcode.com/problems/reorder-list/'
  },
  {
    title: 'Remove Nth Node From End of List',
    difficulty: 'Medium',
    category: 'Linked List',
    primaryPattern: 'Fast & Slow Pointers',
    secondaryPatterns: [],
    dataStructures: ['Linked List'],
    url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/'
  },
  {
    title: 'Copy List With Random Pointer',
    difficulty: 'Medium',
    category: 'Linked List',
    primaryPattern: 'Hash Map / Hash Set',
    secondaryPatterns: [],
    dataStructures: ['Linked List', 'Hash Map'],
    url: 'https://leetcode.com/problems/copy-list-with-random-pointer/'
  },
  {
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    category: 'Linked List',
    primaryPattern: 'Linked List Traversal',
    secondaryPatterns: [],
    dataStructures: ['Linked List'],
    url: 'https://leetcode.com/problems/add-two-numbers/'
  },
  {
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    category: 'Linked List',
    primaryPattern: 'Fast & Slow Pointers',
    secondaryPatterns: ['Cycle Detection'],
    dataStructures: ['Linked List'],
    url: 'https://leetcode.com/problems/linked-list-cycle/'
  },
  {
    title: 'Find the Duplicate Number',
    difficulty: 'Medium',
    category: 'Linked List',
    primaryPattern: 'Fast & Slow Pointers',
    secondaryPatterns: ['Cycle Detection'],
    dataStructures: ['Array'],
    url: 'https://leetcode.com/problems/find-the-duplicate-number/'
  },
  {
    title: 'LRU Cache',
    difficulty: 'Medium',
    category: 'Linked List',
    primaryPattern: 'Hash Map / Hash Set',
    secondaryPatterns: ['Linked List'],
    dataStructures: ['Hash Map', 'Doubly Linked List'],
    url: 'https://leetcode.com/problems/lru-cache/'
  },
  {
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    category: 'Linked List',
    primaryPattern: 'K-way Merge',
    secondaryPatterns: ['Heap'],
    dataStructures: ['Linked List', 'Heap'],
    url: 'https://leetcode.com/problems/merge-k-sorted-lists/'
  },
  {
    title: 'Reverse Nodes in k-Group',
    difficulty: 'Hard',
    category: 'Linked List',
    primaryPattern: 'Linked List Reversal',
    secondaryPatterns: [],
    dataStructures: ['Linked List'],
    url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/'
  },

  // TREES
  {
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    category: 'Trees',
    primaryPattern: 'Tree DFS',
    secondaryPatterns: [],
    dataStructures: ['Binary Tree'],
    url: 'https://leetcode.com/problems/invert-binary-tree/'
  },
  {
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    category: 'Trees',
    primaryPattern: 'Tree DFS',
    secondaryPatterns: ['Tree BFS'],
    dataStructures: ['Binary Tree'],
    url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/'
  },
  {
    title: 'Diameter of Binary Tree',
    difficulty: 'Easy',
    category: 'Trees',
    primaryPattern: 'Tree DFS',
    secondaryPatterns: ['Tree DP'],
    dataStructures: ['Binary Tree'],
    url: 'https://leetcode.com/problems/diameter-of-binary-tree/'
  },
  {
    title: 'Balanced Binary Tree',
    difficulty: 'Easy',
    category: 'Trees',
    primaryPattern: 'Tree DFS',
    secondaryPatterns: [],
    dataStructures: ['Binary Tree'],
    url: 'https://leetcode.com/problems/balanced-binary-tree/'
  },
  {
    title: 'Same Tree',
    difficulty: 'Easy',
    category: 'Trees',
    primaryPattern: 'Tree DFS',
    secondaryPatterns: [],
    dataStructures: ['Binary Tree'],
    url: 'https://leetcode.com/problems/same-tree/'
  },
  {
    title: 'Subtree of Another Tree',
    difficulty: 'Easy',
    category: 'Trees',
    primaryPattern: 'Tree DFS',
    secondaryPatterns: [],
    dataStructures: ['Binary Tree'],
    url: 'https://leetcode.com/problems/subtree-of-another-tree/'
  },
  {
    title: 'Lowest Common Ancestor of a Binary Search Tree',
    difficulty: 'Medium',
    category: 'Trees',
    primaryPattern: 'Binary Search Tree',
    secondaryPatterns: [],
    dataStructures: ['Binary Search Tree'],
    url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/'
  },
  {
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    category: 'Trees',
    primaryPattern: 'Tree BFS',
    secondaryPatterns: [],
    dataStructures: ['Binary Tree', 'Queue'],
    url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/'
  },
  {
    title: 'Binary Tree Right Side View',
    difficulty: 'Medium',
    category: 'Trees',
    primaryPattern: 'Tree BFS',
    secondaryPatterns: ['Tree DFS'],
    dataStructures: ['Binary Tree', 'Queue'],
    url: 'https://leetcode.com/problems/binary-tree-right-side-view/'
  },
  {
    title: 'Count Good Nodes in Binary Tree',
    difficulty: 'Medium',
    category: 'Trees',
    primaryPattern: 'Tree DFS',
    secondaryPatterns: [],
    dataStructures: ['Binary Tree'],
    url: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/'
  },
  {
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    category: 'Trees',
    primaryPattern: 'Binary Search Tree',
    secondaryPatterns: ['Tree DFS'],
    dataStructures: ['Binary Search Tree'],
    url: 'https://leetcode.com/problems/validate-binary-search-tree/'
  },
  {
    title: 'Kth Smallest Element in a BST',
    difficulty: 'Medium',
    category: 'Trees',
    primaryPattern: 'Binary Search Tree',
    secondaryPatterns: ['Tree DFS'],
    dataStructures: ['Binary Search Tree'],
    url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/'
  },
  {
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    difficulty: 'Medium',
    category: 'Trees',
    primaryPattern: 'Divide and Conquer',
    secondaryPatterns: ['Tree DFS'],
    dataStructures: ['Binary Tree'],
    url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/'
  },
  {
    title: 'Binary Tree Maximum Path Sum',
    difficulty: 'Hard',
    category: 'Trees',
    primaryPattern: 'Tree DP',
    secondaryPatterns: ['Tree DFS'],
    dataStructures: ['Binary Tree'],
    url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/'
  },
  {
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'Hard',
    category: 'Trees',
    primaryPattern: 'Tree DFS',
    secondaryPatterns: ['Tree BFS'],
    dataStructures: ['Binary Tree'],
    url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/'
  },

  // TRIES
  {
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'Medium',
    category: 'Tries',
    primaryPattern: 'Trie',
    secondaryPatterns: [],
    dataStructures: ['Trie'],
    url: 'https://leetcode.com/problems/implement-trie-prefix-tree/'
  },
  {
    title: 'Design Add and Search Words Data Structure',
    difficulty: 'Medium',
    category: 'Tries',
    primaryPattern: 'Trie',
    secondaryPatterns: ['DFS'],
    dataStructures: ['Trie'],
    url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/'
  },
  {
    title: 'Word Search II',
    difficulty: 'Hard',
    category: 'Tries',
    primaryPattern: 'Trie + Backtracking',
    secondaryPatterns: ['DFS'],
    dataStructures: ['Trie', 'Matrix'],
    url: 'https://leetcode.com/problems/word-search-ii/'
  },

  // HEAP / PRIORITY QUEUE
  {
    title: 'Kth Largest Element in a Stream',
    difficulty: 'Easy',
    category: 'Heap / Priority Queue',
    primaryPattern: 'Top K Elements',
    secondaryPatterns: [],
    dataStructures: ['Heap'],
    url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/'
  },
  {
    title: 'Last Stone Weight',
    difficulty: 'Easy',
    category: 'Heap / Priority Queue',
    primaryPattern: 'Heap',
    secondaryPatterns: [],
    dataStructures: ['Heap'],
    url: 'https://leetcode.com/problems/last-stone-weight/'
  },
  {
    title: 'K Closest Points to Origin',
    difficulty: 'Medium',
    category: 'Heap / Priority Queue',
    primaryPattern: 'Top K Elements',
    secondaryPatterns: [],
    dataStructures: ['Heap'],
    url: 'https://leetcode.com/problems/k-closest-points-to-origin/'
  },
  {
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    category: 'Heap / Priority Queue',
    primaryPattern: 'Top K Elements',
    secondaryPatterns: [],
    dataStructures: ['Heap'],
    url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/'
  },
  {
    title: 'Task Scheduler',
    difficulty: 'Medium',
    category: 'Heap / Priority Queue',
    primaryPattern: 'Greedy',
    secondaryPatterns: ['Heap'],
    dataStructures: ['Heap'],
    url: 'https://leetcode.com/problems/task-scheduler/'
  },
  {
    title: 'Design Twitter',
    difficulty: 'Medium',
    category: 'Heap / Priority Queue',
    primaryPattern: 'K-way Merge',
    secondaryPatterns: ['Heap'],
    dataStructures: ['Heap', 'Hash Map'],
    url: 'https://leetcode.com/problems/design-twitter/'
  },
  {
    title: 'Find Median from Data Stream',
    difficulty: 'Hard',
    category: 'Heap / Priority Queue',
    primaryPattern: 'Two Heaps',
    secondaryPatterns: [],
    dataStructures: ['Heap'],
    url: 'https://leetcode.com/problems/find-median-from-data-stream/'
  },

  // BACKTRACKING
  {
    title: 'Subsets',
    difficulty: 'Medium',
    category: 'Backtracking',
    primaryPattern: 'Backtracking',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/subsets/'
  },
  {
    title: 'Combination Sum',
    difficulty: 'Medium',
    category: 'Backtracking',
    primaryPattern: 'Backtracking',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/combination-sum/'
  },
  {
    title: 'Permutations',
    difficulty: 'Medium',
    category: 'Backtracking',
    primaryPattern: 'Backtracking',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/permutations/'
  },
  {
    title: 'Subsets II',
    difficulty: 'Medium',
    category: 'Backtracking',
    primaryPattern: 'Backtracking',
    secondaryPatterns: ['Sorting'],
    dataStructures: [],
    url: 'https://leetcode.com/problems/subsets-ii/'
  },
  {
    title: 'Combination Sum II',
    difficulty: 'Medium',
    category: 'Backtracking',
    primaryPattern: 'Backtracking',
    secondaryPatterns: ['Sorting'],
    dataStructures: [],
    url: 'https://leetcode.com/problems/combination-sum-ii/'
  },
  {
    title: 'Word Search',
    difficulty: 'Medium',
    category: 'Backtracking',
    primaryPattern: 'DFS',
    secondaryPatterns: ['Backtracking', 'Matrix Traversal'],
    dataStructures: ['Matrix'],
    url: 'https://leetcode.com/problems/word-search/'
  },
  {
    title: 'Palindrome Partitioning',
    difficulty: 'Medium',
    category: 'Backtracking',
    primaryPattern: 'Backtracking',
    secondaryPatterns: ['DFS'],
    dataStructures: [],
    url: 'https://leetcode.com/problems/palindrome-partitioning/'
  },
  {
    title: 'Letter Combinations of a Phone Number',
    difficulty: 'Medium',
    category: 'Backtracking',
    primaryPattern: 'Backtracking',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/'
  },
  {
    title: 'N-Queens',
    difficulty: 'Hard',
    category: 'Backtracking',
    primaryPattern: 'Backtracking',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/n-queens/'
  },

  // GRAPHS
  {
    title: 'Number of Islands',
    difficulty: 'Medium',
    category: 'Graphs',
    primaryPattern: 'DFS',
    secondaryPatterns: ['BFS', 'Matrix Traversal'],
    dataStructures: ['Grid'],
    url: 'https://leetcode.com/problems/number-of-islands/'
  },
  {
    title: 'Clone Graph',
    difficulty: 'Medium',
    category: 'Graphs',
    primaryPattern: 'DFS',
    secondaryPatterns: ['BFS'],
    dataStructures: ['Graph', 'Hash Map'],
    url: 'https://leetcode.com/problems/clone-graph/'
  },
  {
    title: 'Max Area of Island',
    difficulty: 'Medium',
    category: 'Graphs',
    primaryPattern: 'DFS',
    secondaryPatterns: ['BFS', 'Matrix Traversal'],
    dataStructures: ['Grid'],
    url: 'https://leetcode.com/problems/max-area-of-island/'
  },
  {
    title: 'Pacific Atlantic Water Flow',
    difficulty: 'Medium',
    category: 'Graphs',
    primaryPattern: 'DFS',
    secondaryPatterns: ['Multi-source BFS', 'Matrix Traversal'],
    dataStructures: ['Grid'],
    url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/'
  },
  {
    title: 'Surrounded Regions',
    difficulty: 'Medium',
    category: 'Graphs',
    primaryPattern: 'DFS',
    secondaryPatterns: ['BFS', 'Matrix Traversal'],
    dataStructures: ['Grid'],
    url: 'https://leetcode.com/problems/surrounded-regions/'
  },
  {
    title: 'Rotting Oranges',
    difficulty: 'Medium',
    category: 'Graphs',
    primaryPattern: 'Multi-source BFS',
    secondaryPatterns: ['Matrix Traversal'],
    dataStructures: ['Queue', 'Grid'],
    url: 'https://leetcode.com/problems/rotting-oranges/'
  },
  {
    title: 'Walls and Gates',
    difficulty: 'Medium',
    category: 'Graphs',
    primaryPattern: 'Multi-source BFS',
    secondaryPatterns: [],
    dataStructures: ['Queue', 'Grid'],
    url: 'https://leetcode.com/problems/walls-and-gates/'
  },
  {
    title: 'Course Schedule',
    difficulty: 'Medium',
    category: 'Graphs',
    primaryPattern: 'Topological Sort',
    secondaryPatterns: ['DFS'],
    dataStructures: ['Graph'],
    url: 'https://leetcode.com/problems/course-schedule/'
  },
  {
    title: 'Course Schedule II',
    difficulty: 'Medium',
    category: 'Graphs',
    primaryPattern: 'Topological Sort',
    secondaryPatterns: ['DFS'],
    dataStructures: ['Graph'],
    url: 'https://leetcode.com/problems/course-schedule-ii/'
  },
  {
    title: 'Redundant Connection',
    difficulty: 'Medium',
    category: 'Graphs',
    primaryPattern: 'Union-Find / DSU',
    secondaryPatterns: [],
    dataStructures: ['Union-Find'],
    url: 'https://leetcode.com/problems/redundant-connection/'
  },
  {
    title: 'Number of Connected Components in an Undirected Graph',
    difficulty: 'Medium',
    category: 'Graphs',
    primaryPattern: 'Union-Find / DSU',
    secondaryPatterns: ['DFS', 'BFS'],
    dataStructures: ['Union-Find', 'Graph'],
    url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/'
  },
  {
    title: 'Graph Valid Tree',
    difficulty: 'Medium',
    category: 'Graphs',
    primaryPattern: 'Union-Find / DSU',
    secondaryPatterns: ['DFS'],
    dataStructures: ['Union-Find', 'Graph'],
    url: 'https://leetcode.com/problems/graph-valid-tree/'
  },
  {
    title: 'Word Ladder',
    difficulty: 'Hard',
    category: 'Graphs',
    primaryPattern: 'BFS',
    secondaryPatterns: [],
    dataStructures: ['Queue', 'Hash Map'],
    url: 'https://leetcode.com/problems/word-ladder/'
  },

  // ADVANCED GRAPHS
  {
    title: 'Reconstruct Itinerary',
    difficulty: 'Hard',
    category: 'Advanced Graphs',
    primaryPattern: 'Eulerian Path',
    secondaryPatterns: ['DFS'],
    dataStructures: ['Graph'],
    url: 'https://leetcode.com/problems/reconstruct-itinerary/'
  },
  {
    title: 'Min Cost to Connect All Points',
    difficulty: 'Medium',
    category: 'Advanced Graphs',
    primaryPattern: 'Minimum Spanning Tree',
    secondaryPatterns: ['Union-Find / DSU'],
    dataStructures: ['Graph', 'Union-Find'],
    url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/'
  },
  {
    title: 'Network Delay Time',
    difficulty: 'Medium',
    category: 'Advanced Graphs',
    primaryPattern: 'Dijkstra',
    secondaryPatterns: ['Shortest Path'],
    dataStructures: ['Graph', 'Heap'],
    url: 'https://leetcode.com/problems/network-delay-time/'
  },
  {
    title: 'Swim in Rising Water',
    difficulty: 'Hard',
    category: 'Advanced Graphs',
    primaryPattern: 'Dijkstra',
    secondaryPatterns: ['Binary Search', 'DFS'],
    dataStructures: ['Heap', 'Grid'],
    url: 'https://leetcode.com/problems/swim-in-rising-water/'
  },
  {
    title: 'Alien Dictionary',
    difficulty: 'Hard',
    category: 'Advanced Graphs',
    primaryPattern: 'Topological Sort',
    secondaryPatterns: ['Graph'],
    dataStructures: ['Graph'],
    url: 'https://leetcode.com/problems/alien-dictionary/'
  },
  {
    title: 'Cheapest Flights Within K Stops',
    difficulty: 'Medium',
    category: 'Advanced Graphs',
    primaryPattern: 'Shortest Path',
    secondaryPatterns: ['Dynamic Programming'],
    dataStructures: ['Graph'],
    url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/'
  },

  // 1-D DYNAMIC PROGRAMMING
  {
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    category: '1-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/climbing-stairs/'
  },
  {
    title: 'Min Cost Climbing Stairs',
    difficulty: 'Easy',
    category: '1-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/min-cost-climbing-stairs/'
  },
  {
    title: 'House Robber',
    difficulty: 'Medium',
    category: '1-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/house-robber/'
  },
  {
    title: 'House Robber II',
    difficulty: 'Medium',
    category: '1-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/house-robber-ii/'
  },
  {
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    category: '1-D Dynamic Programming',
    primaryPattern: 'Expand Around Center',
    secondaryPatterns: ['Dynamic Programming'],
    dataStructures: [],
    url: 'https://leetcode.com/problems/longest-palindromic-substring/'
  },
  {
    title: 'Palindromic Substrings',
    difficulty: 'Medium',
    category: '1-D Dynamic Programming',
    primaryPattern: 'Expand Around Center',
    secondaryPatterns: ['Dynamic Programming'],
    dataStructures: [],
    url: 'https://leetcode.com/problems/palindromic-substrings/'
  },
  {
    title: 'Decode Ways',
    difficulty: 'Medium',
    category: '1-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/decode-ways/'
  },
  {
    title: 'Coin Change',
    difficulty: 'Medium',
    category: '1-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/coin-change/'
  },
  {
    title: 'Maximum Product Subarray',
    difficulty: 'Medium',
    category: '1-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/maximum-product-subarray/'
  },
  {
    title: 'Word Break',
    difficulty: 'Medium',
    category: '1-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/word-break/'
  },
  {
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    category: '1-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: ['Binary Search'],
    dataStructures: [],
    url: 'https://leetcode.com/problems/longest-increasing-subsequence/'
  },
  {
    title: 'Partition Equal Subset Sum',
    difficulty: 'Medium',
    category: '1-D Dynamic Programming',
    primaryPattern: '0/1 Knapsack',
    secondaryPatterns: ['Dynamic Programming'],
    dataStructures: [],
    url: 'https://leetcode.com/problems/partition-equal-subset-sum/'
  },

  // 2-D DYNAMIC PROGRAMMING
  {
    title: 'Unique Paths',
    difficulty: 'Medium',
    category: '2-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/unique-paths/'
  },
  {
    title: 'Longest Common Subsequence',
    difficulty: 'Medium',
    category: '2-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/longest-common-subsequence/'
  },
  {
    title: 'Best Time to Buy and Sell Stock with Cooldown',
    difficulty: 'Medium',
    category: '2-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/'
  },
  {
    title: 'Coin Change II',
    difficulty: 'Medium',
    category: '2-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/coin-change-ii/'
  },
  {
    title: 'Target Sum',
    difficulty: 'Medium',
    category: '2-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/target-sum/'
  },
  {
    title: 'Interleaving String',
    difficulty: 'Medium',
    category: '2-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/interleaving-string/'
  },
  {
    title: 'Longest Increasing Path in a Matrix',
    difficulty: 'Hard',
    category: '2-D Dynamic Programming',
    primaryPattern: 'DFS',
    secondaryPatterns: ['Dynamic Programming', 'Matrix Traversal'],
    dataStructures: ['Matrix'],
    url: 'https://leetcode.com/problems/longest-increasing-path-in-a-matrix/'
  },
  {
    title: 'Distinct Subsequences',
    difficulty: 'Hard',
    category: '2-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/distinct-subsequences/'
  },
  {
    title: 'Edit Distance',
    difficulty: 'Medium',
    category: '2-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/edit-distance/'
  },
  {
    title: 'Burst Balloons',
    difficulty: 'Hard',
    category: '2-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: ['Divide and Conquer'],
    dataStructures: [],
    url: 'https://leetcode.com/problems/burst-balloons/'
  },
  {
    title: 'Regular Expression Matching',
    difficulty: 'Hard',
    category: '2-D Dynamic Programming',
    primaryPattern: 'Dynamic Programming',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/regular-expression-matching/'
  },

  // GREEDY
  {
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    category: 'Greedy',
    primaryPattern: 'Kadane\'s Algorithm',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/maximum-subarray/'
  },
  {
    title: 'Jump Game',
    difficulty: 'Medium',
    category: 'Greedy',
    primaryPattern: 'Greedy',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/jump-game/'
  },
  {
    title: 'Jump Game II',
    difficulty: 'Medium',
    category: 'Greedy',
    primaryPattern: 'Greedy',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/jump-game-ii/'
  },
  {
    title: 'Gas Station',
    difficulty: 'Medium',
    category: 'Greedy',
    primaryPattern: 'Greedy',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/gas-station/'
  },
  {
    title: 'Hand of Straights',
    difficulty: 'Medium',
    category: 'Greedy',
    primaryPattern: 'Greedy',
    secondaryPatterns: ['Heap'],
    dataStructures: ['Heap'],
    url: 'https://leetcode.com/problems/hand-of-straights/'
  },
  {
    title: 'Merge Triplets to Form Target Triplet',
    difficulty: 'Medium',
    category: 'Greedy',
    primaryPattern: 'Greedy',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/merge-triplets-to-form-target-triplet/'
  },
  {
    title: 'Partition Labels',
    difficulty: 'Medium',
    category: 'Greedy',
    primaryPattern: 'Greedy',
    secondaryPatterns: ['Two Pointers'],
    dataStructures: [],
    url: 'https://leetcode.com/problems/partition-labels/'
  },
  {
    title: 'Valid Parenthesis String',
    difficulty: 'Medium',
    category: 'Greedy',
    primaryPattern: 'Range Tracking',
    secondaryPatterns: ['Greedy'],
    dataStructures: [],
    url: 'https://leetcode.com/problems/valid-parenthesis-string/'
  },

  // INTERVALS
  {
    title: 'Insert Interval',
    difficulty: 'Medium',
    category: 'Intervals',
    primaryPattern: 'Intervals',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/insert-interval/'
  },
  {
    title: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'Intervals',
    primaryPattern: 'Intervals',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/merge-intervals/'
  },
  {
    title: 'Non-overlapping Intervals',
    difficulty: 'Medium',
    category: 'Intervals',
    primaryPattern: 'Greedy',
    secondaryPatterns: ['Intervals'],
    dataStructures: [],
    url: 'https://leetcode.com/problems/non-overlapping-intervals/'
  },
  {
    title: 'Meeting Rooms',
    difficulty: 'Easy',
    category: 'Intervals',
    primaryPattern: 'Intervals',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/meeting-rooms/'
  },
  {
    title: 'Meeting Rooms II',
    difficulty: 'Medium',
    category: 'Intervals',
    primaryPattern: 'Intervals',
    secondaryPatterns: ['Heap'],
    dataStructures: ['Heap'],
    url: 'https://leetcode.com/problems/meeting-rooms-ii/'
  },
  {
    title: 'Minimum Interval to Include Each Query',
    difficulty: 'Hard',
    category: 'Intervals',
    primaryPattern: 'Heap + Sorting',
    secondaryPatterns: ['Intervals'],
    dataStructures: ['Heap'],
    url: 'https://leetcode.com/problems/minimum-interval-to-include-each-query/'
  },

  // MATH & GEOMETRY
  {
    title: 'Rotate Image',
    difficulty: 'Medium',
    category: 'Math & Geometry',
    primaryPattern: 'Matrix Manipulation',
    secondaryPatterns: [],
    dataStructures: ['Matrix'],
    url: 'https://leetcode.com/problems/rotate-image/'
  },
  {
    title: 'Spiral Matrix',
    difficulty: 'Medium',
    category: 'Math & Geometry',
    primaryPattern: 'Matrix Traversal',
    secondaryPatterns: [],
    dataStructures: ['Matrix'],
    url: 'https://leetcode.com/problems/spiral-matrix/'
  },
  {
    title: 'Set Matrix Zeroes',
    difficulty: 'Medium',
    category: 'Math & Geometry',
    primaryPattern: 'Matrix Manipulation',
    secondaryPatterns: [],
    dataStructures: ['Matrix'],
    url: 'https://leetcode.com/problems/set-matrix-zeroes/'
  },
  {
    title: 'Happy Number',
    difficulty: 'Easy',
    category: 'Math & Geometry',
    primaryPattern: 'Fast & Slow Pointers',
    secondaryPatterns: ['Cycle Detection'],
    dataStructures: ['Set'],
    url: 'https://leetcode.com/problems/happy-number/'
  },
  {
    title: 'Plus One',
    difficulty: 'Easy',
    category: 'Math & Geometry',
    primaryPattern: 'Math / Digit Manipulation',
    secondaryPatterns: [],
    dataStructures: ['Array'],
    url: 'https://leetcode.com/problems/plus-one/'
  },
  {
    title: 'Pow(x, n)',
    difficulty: 'Medium',
    category: 'Math & Geometry',
    primaryPattern: 'Divide and Conquer',
    secondaryPatterns: [],
    dataStructures: ['None'],
    url: 'https://leetcode.com/problems/powx-n/'
  },
  {
    title: 'Multiply Strings',
    difficulty: 'Medium',
    category: 'Math & Geometry',
    primaryPattern: 'Math / Digit Manipulation',
    secondaryPatterns: [],
    dataStructures: ['Array'],
    url: 'https://leetcode.com/problems/multiply-strings/'
  },
  {
    title: 'Detect Squares',
    difficulty: 'Medium',
    category: 'Math & Geometry',
    primaryPattern: 'Hash Map / Hash Set',
    secondaryPatterns: [],
    dataStructures: ['Hash Map'],
    url: 'https://leetcode.com/problems/detect-squares/'
  },

  // BIT MANIPULATION
  {
    title: 'Single Number',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    primaryPattern: 'Bit Manipulation',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/single-number/'
  },
  {
    title: 'Number of 1 Bits',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    primaryPattern: 'Bit Manipulation',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/number-of-1-bits/'
  },
  {
    title: 'Counting Bits',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    primaryPattern: 'Bit Manipulation',
    secondaryPatterns: ['Dynamic Programming'],
    dataStructures: [],
    url: 'https://leetcode.com/problems/counting-bits/'
  },
  {
    title: 'Reverse Bits',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    primaryPattern: 'Bit Manipulation',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/reverse-bits/'
  },
  {
    title: 'Missing Number',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    primaryPattern: 'Bit Manipulation',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/missing-number/'
  },
  {
    title: 'Sum of Two Integers',
    difficulty: 'Medium',
    category: 'Bit Manipulation',
    primaryPattern: 'Bit Manipulation',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/sum-of-two-integers/'
  },
  {
    title: 'Reverse Integer',
    difficulty: 'Medium',
    category: 'Bit Manipulation',
    primaryPattern: 'Math / Digit Manipulation',
    secondaryPatterns: [],
    dataStructures: [],
    url: 'https://leetcode.com/problems/reverse-integer/'
  }
];

module.exports = {
  canonicalCategories,
  canonicalPatterns,
  canonicalProblems
};
