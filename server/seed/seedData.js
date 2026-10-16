const patterns = [
  // 1. Pointer & Window Techniques
  {
    name: 'Fast & Slow Pointers (Tortoise & Hare)',
    category: 'Pointer & Window Techniques',
    description: 'Cycle detection in linked lists/arrays and middle element determination.'
  },
  {
    name: 'Prefix Sum / Running Sum',
    category: 'Pointer & Window Techniques',
    description: 'Subarray sum queries and range sum optimization.'
  },
  {
    name: 'Two Pointers (Inward vs. Same Direction / Merge)',
    category: 'Pointer & Window Techniques',
    description: 'Searching or merging elements using opposing or direction-aligned pointers.'
  },

  // 2. Stack & Queue Patterns
  {
    name: 'Monotonic Stack',
    category: 'Stack & Queue Patterns',
    description: 'Next greater/smaller element queries and histogram evaluation.'
  },
  {
    name: 'Monotonic Deque',
    category: 'Stack & Queue Patterns',
    description: 'Sliding window maximum/minimum tracking in linear time.'
  },

  // 3. Tree & Graph Traversal Techniques
  {
    name: 'Breadth-First Search (BFS)',
    category: 'Tree & Graph Traversal Techniques',
    description: 'Level-order traversal and shortest path search in unweighted graphs.'
  },
  {
    name: 'Depth-First Search (DFS) / Backtracking',
    category: 'Tree & Graph Traversal Techniques',
    description: 'Permutations, subsets, word search, and deep graph exploration.'
  },
  {
    name: 'Topological Sort',
    category: 'Tree & Graph Traversal Techniques',
    description: "Kahn's algorithm and indegree BFS for task scheduling and DAG ordering."
  },
  {
    name: 'Union-Find / Disjoint Set Union (DSU)',
    category: 'Tree & Graph Traversal Techniques',
    description: 'Connected components tracking, cycle detection, and Kruskal MST.'
  },
  {
    name: "Dijkstra's / Shortest Path",
    category: 'Tree & Graph Traversal Techniques',
    description: 'Shortest path computation in weighted non-negative edge graphs.'
  },

  // 4. Heap & Priority Queue Patterns
  {
    name: 'Top K Elements / Min-Heap & Max-Heap',
    category: 'Heap & Priority Queue Patterns',
    description: 'Kth largest/smallest elements and merging K sorted streams.'
  },
  {
    name: 'Two Heaps Pattern',
    category: 'Heap & Priority Queue Patterns',
    description: 'Continuous median tracking using balanced min-heap and max-heap.'
  },
  {
    name: 'K-way Merge',
    category: 'Heap & Priority Queue Patterns',
    description: 'Merging multiple sorted lists or streams using priority queues.'
  },

  // 5. Algorithmic Paradigms
  {
    name: 'Greedy',
    category: 'Algorithmic Paradigms',
    description: 'Locally optimal decision-making for interval scheduling and jump games.'
  },
  {
    name: 'Intervals / Overlapping Intervals',
    category: 'Algorithmic Paradigms',
    description: 'Merging, inserting, and scheduling overlapping range intervals.'
  },
  {
    name: 'Divide and Conquer',
    category: 'Algorithmic Paradigms',
    description: 'Dividing subproblems recursively and combining optimal sub-results.'
  },
  {
    name: 'Binary Search on Answer / Monotonic Predicate',
    category: 'Algorithmic Paradigms',
    description: 'Searching over a monotonic solution space for boundary conditions.'
  },

  // 6. Bit & Math Techniques
  {
    name: 'Bit Manipulation',
    category: 'Bit & Math Techniques',
    description: 'XOR tricks, single number extraction, and bitwise state counting.'
  },
  {
    name: 'Math / Geometry',
    category: 'Bit & Math Techniques',
    description: 'Modular arithmetic, matrix rotation, GCD, and geometric algorithms.'
  },

  // 7. Advanced / Specialized Techniques
  {
    name: 'Trie (Prefix Tree)',
    category: 'Advanced / Specialized Techniques',
    description: 'Prefix matching, word searching, and dictionary retrieval.'
  },
  {
    name: 'Matrix Traversal / 2D Grid DFS/BFS',
    category: 'Advanced / Specialized Techniques',
    description: '2D grid exploration, island counting, and grid shortest paths.'
  }
];

const sampleProblems = [
  // Pointer & Window Techniques
  {
    title: 'Two Sum II - Input Array Is Sorted',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
    difficulty: 'Medium',
    description: 'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to target.',
    patternNames: ['Two Pointers (Inward vs. Same Direction / Merge)']
  },
  {
    title: 'Container With Most Water',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/container-with-most-water/',
    difficulty: 'Medium',
    description: 'Find two lines that together with the x-axis form a container, such that the container contains the most water.',
    patternNames: ['Two Pointers (Inward vs. Same Direction / Merge)']
  },
  {
    title: '3Sum',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/3sum/',
    difficulty: 'Medium',
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
    patternNames: ['Two Pointers (Inward vs. Same Direction / Merge)']
  },
  {
    title: 'Valid Palindrome',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/valid-palindrome/',
    difficulty: 'Easy',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase and removing non-alphanumeric characters, it reads the same forward and backward.',
    patternNames: ['Two Pointers (Inward vs. Same Direction / Merge)']
  },
  {
    title: 'Linked List Cycle',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/linked-list-cycle/',
    difficulty: 'Easy',
    description: 'Given head, the head of a linked list, determine if the linked list has a cycle in it.',
    patternNames: ['Fast & Slow Pointers (Tortoise & Hare)']
  },
  {
    title: 'Two Sum',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/two-sum/',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    patternNames: ['Prefix Sum / Running Sum']
  },
  {
    title: 'Subarray Sum Equals K',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/subarray-sum-equals-k/',
    difficulty: 'Medium',
    description: 'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.',
    patternNames: ['Prefix Sum / Running Sum']
  },

  // Stack & Queue Patterns
  {
    title: 'Daily Temperatures',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/daily-temperatures/',
    difficulty: 'Medium',
    description: 'Given an array of integers temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.',
    patternNames: ['Monotonic Stack']
  },
  {
    title: 'Next Greater Element',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/next-greater-element-i/',
    difficulty: 'Easy',
    description: 'The next greater element of some element x in an array is the first greater element that is to the right of x in the same array.',
    patternNames: ['Monotonic Stack']
  },
  {
    title: 'Valid Parentheses',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/valid-parentheses/',
    difficulty: 'Easy',
    description: 'Given a string s containing just characters (, ), {, }, [ and ], determine if the input string is valid.',
    patternNames: ['Monotonic Stack']
  },
  {
    title: 'Sliding Window Maximum',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/sliding-window-maximum/',
    difficulty: 'Hard',
    description: 'You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. Return the max sliding window.',
    patternNames: ['Monotonic Deque']
  },

  // Tree & Graph Traversal Techniques
  {
    title: 'Number of Islands',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/number-of-islands/',
    difficulty: 'Medium',
    description: 'Given an m x n 2D binary grid grid which represents a map of 1s (land) and 0s (water), return the number of islands.',
    patternNames: ['Matrix Traversal / 2D Grid DFS/BFS']
  },
  {
    title: 'Course Schedule',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/course-schedule/',
    difficulty: 'Medium',
    description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Some courses may have prerequisites.',
    patternNames: ['Topological Sort']
  },
  {
    title: 'Clone Graph',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/clone-graph/',
    difficulty: 'Medium',
    description: 'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.',
    patternNames: ['Breadth-First Search (BFS)']
  },
  {
    title: 'Invert Binary Tree',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/invert-binary-tree/',
    difficulty: 'Easy',
    description: 'Given the root of a binary tree, invert the tree, and return its root.',
    patternNames: ['Depth-First Search (DFS) / Backtracking']
  },

  // Heap & Priority Queue Patterns
  {
    title: 'Kth Largest Element in an Array',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
    difficulty: 'Medium',
    description: 'Given an integer array nums and an integer k, return the kth largest element in the array.',
    patternNames: ['Top K Elements / Min-Heap & Max-Heap']
  },
  {
    title: 'Find Median from Data Stream',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/find-median-from-data-stream/',
    difficulty: 'Hard',
    description: 'The median is the middle value in an ordered integer list. Implement the MedianFinder class.',
    patternNames: ['Two Heaps Pattern']
  },

  // Algorithmic Paradigms
  {
    title: 'Koko Eating Bananas',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/koko-eating-bananas/',
    difficulty: 'Medium',
    description: 'Return the minimum integer k such that Koko can eat all the bananas within h hours.',
    patternNames: ['Binary Search on Answer / Monotonic Predicate']
  },
  {
    title: 'Merge Intervals',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/merge-intervals/',
    difficulty: 'Medium',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
    patternNames: ['Intervals / Overlapping Intervals']
  },
  {
    title: 'Jump Game',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/jump-game/',
    difficulty: 'Medium',
    description: 'You are given an integer array nums. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length at that position.',
    patternNames: ['Greedy']
  },

  // Bit & Math Techniques
  {
    title: 'Single Number',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/single-number/',
    difficulty: 'Easy',
    description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.',
    patternNames: ['Bit Manipulation']
  },
  {
    title: 'Rotate Image',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/rotate-image/',
    difficulty: 'Medium',
    description: 'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).',
    patternNames: ['Math / Geometry']
  },

  // Advanced / Specialized Techniques
  {
    title: 'Implement Trie (Prefix Tree)',
    platform: 'LeetCode',
    url: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
    difficulty: 'Medium',
    description: 'A trie or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings.',
    patternNames: ['Trie (Prefix Tree)']
  }
];

module.exports = { patterns, sampleProblems };
