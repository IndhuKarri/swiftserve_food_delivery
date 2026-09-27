# Algorithms & Mathematical Formulation

## 1. Breadth-First Search (BFS) Nearest Rider Search

### Algorithm Specification:
```
Input: Graph G = (V, E), Start Node s (Restaurant Zone), Available Riders Map R
Output: Assigned Rider R*, Found Zone Z*, Shortest Distance d, Route Path P

1. Initialize Queue Q <- Empty FIFO Queue
2. Initialize Visited Set V_set <- { s }
3. Initialize Distance Map dist[s] <- 0
4. Initialize Predecessor Map pred[s] <- null

5. If riders exist at s:
      return top-rated rider at s with distance 0

6. Enqueue s into Q

7. While Q is not empty:
     u <- Dequeue from Q
     If u != s and riders exist at u:
         return top-rated rider at u with dist[u] and reconstructed path

     For each neighbor v in Adj[u]:
         If v not in V_set:
             Add v to V_set
             pred[v] <- u
             dist[v] <- dist[u] + weight(u, v)
             Enqueue v into Q

8. Return null (No reachable available rider)
```

### Complexity:
- **Time Complexity**: $\mathcal{O}(|V| + |E|)$
- **Space Complexity**: $\mathcal{O}(|V|)$

---

## 2. Machine Learning ETA Regression (Ordinary Least Squares)

### Regression Formula:
$$\hat{Y} = b_0 + b_1 X_1 + b_2 X_2 + b_3 X_3 + b_4 X_4$$

Where:
- $\hat{Y}$: Predicted Delivery Time in minutes
- $X_1$: Distance in kilometers
- $X_2$: Encoded Time of Day ($\text{Morning}=0, \text{Afternoon}=1, \text{Evening}=2, \text{Night}=3$)
- $X_3$: Encoded Traffic Level ($\text{Low}=0, \text{Medium}=1, \text{High}=2$)
- $X_4$: Encoded Weather Condition ($\text{Clear}=0, \text{Rain}=1, \text{Storm}=2$)

### Normal Equation Solution:
$$\beta = (X^T X)^{-1} X^T Y$$
Where $X$ is the $N \times 5$ feature matrix (with bias column 1) and $Y$ is the $N \times 1$ actual delivery time vector.

### Evaluation Metrics:
1. **Mean Absolute Error (MAE)**:
   $$\text{MAE} = \frac{1}{N} \sum_{i=1}^N |Y_i - \hat{Y}_i|$$
2. **Coefficient of Determination ($R^2$)**:
   $$R^2 = 1 - \frac{\sum_{i=1}^N (Y_i - \hat{Y}_i)^2}{\sum_{i=1}^N (Y_i - \bar{Y})^2}$$
3. **Root Mean Squared Error (RMSE)**:
   $$\text{RMSE} = \sqrt{\frac{1}{N} \sum_{i=1}^N (Y_i - \hat{Y}_i)^2}$$
