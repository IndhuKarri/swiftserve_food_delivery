import { Zone, ZoneConnection, Rider, BFSStep, BFSResult } from '../types';

export interface GraphEdge {
  target: string;
  distanceKm: number;
}

export class ZoneGraph {
  private adjacencyList: Map<string, GraphEdge[]> = new Map();
  private zonesMap: Map<string, Zone> = new Map();

  constructor(zones: Zone[], connections: ZoneConnection[]) {
    zones.forEach(zone => {
      this.zonesMap.set(zone.zoneId, zone);
      this.adjacencyList.set(zone.zoneId, []);
    });

    connections.forEach(conn => {
      const { zoneA, zoneB, distanceKm } = conn;
      if (this.adjacencyList.has(zoneA) && this.adjacencyList.has(zoneB)) {
        this.adjacencyList.get(zoneA)!.push({ target: zoneB, distanceKm });
        this.adjacencyList.get(zoneB)!.push({ target: zoneA, distanceKm });
      }
    });
  }

  public getNeighbors(zoneId: string): GraphEdge[] {
    return this.adjacencyList.get(zoneId) || [];
  }

  public getZone(zoneId: string): Zone | undefined {
    return this.zonesMap.get(zoneId);
  }

  public getAllZones(): Zone[] {
    return Array.from(this.zonesMap.values());
  }

  /**
   * Authentic Breadth-First Search (BFS) to find the nearest available rider
   * Explores the zone graph level-by-level starting from restaurantZoneId.
   *
   * Time Complexity: O(V + E) where V = Zones, E = Zone Connections
   * Space Complexity: O(V) for the queue, visited set, and distance maps.
   */
  public findNearestAvailableRider(
    restaurantZoneId: string,
    allRiders: Rider[]
  ): BFSResult {
    const startTime = performance.now();

    const queue: string[] = [];
    const visited = new Set<string>();
    const distanceMap: Record<string, number> = {};
    const predecessorMap: Record<string, string | null> = {};
    const steps: BFSStep[] = [];
    const traversedZones: string[] = [];

    // Filter available riders only (Status === AVAILABLE & currentOrders === 0)
    const availableRiders = allRiders.filter(
      r => r.status === 'AVAILABLE' && r.currentOrders === 0
    );

    // Initialize BFS
    queue.push(restaurantZoneId);
    visited.add(restaurantZoneId);
    distanceMap[restaurantZoneId] = 0;
    predecessorMap[restaurantZoneId] = null;

    let stepIndex = 1;
    let selectedRider: Rider | null = null;
    let riderFoundAtZone: string | null = null;

    // Check if any available rider is already in the restaurant's immediate zone (Distance = 0 km)
    const ridersInStartZone = availableRiders.filter(
      r => r.currentZoneId === restaurantZoneId
    );

    steps.push({
      stepIndex: stepIndex++,
      currentNode: restaurantZoneId,
      queue: [...queue],
      visited: Array.from(visited),
      discoveredRiders: ridersInStartZone,
      distanceMap: { ...distanceMap },
      predecessorMap: { ...predecessorMap },
      description: `Initialized BFS at Restaurant Zone [${restaurantZoneId}]. Queue: [${restaurantZoneId}]. Visited: {${restaurantZoneId}}.`
    });

    if (ridersInStartZone.length > 0) {
      // Pick highest rated or most experienced rider in same zone
      selectedRider = ridersInStartZone.sort((a, b) => b.rating - a.rating)[0];
      riderFoundAtZone = restaurantZoneId;
      traversedZones.push(restaurantZoneId);

      steps.push({
        stepIndex: stepIndex++,
        currentNode: restaurantZoneId,
        queue: [],
        visited: Array.from(visited),
        discoveredRiders: [selectedRider],
        distanceMap: { ...distanceMap },
        predecessorMap: { ...predecessorMap },
        description: `OPTIMAL HIT! Found available rider [${selectedRider.name}] directly inside Restaurant Zone [${restaurantZoneId}] with distance 0.0 km.`
      });

      const endTime = performance.now();
      return {
        startZone: restaurantZoneId,
        assignedRider: selectedRider,
        riderFoundAtZone,
        distanceKm: 0,
        traversedZones,
        routePath: [restaurantZoneId],
        steps,
        timeComplexity: 'O(V + E)',
        spaceComplexity: 'O(V)',
        executionTimeMs: +(endTime - startTime).toFixed(3)
      };
    }

    // Standard BFS Queue Traversal
    while (queue.length > 0) {
      const currentZoneId = queue.shift()!;
      traversedZones.push(currentZoneId);

      const neighbors = this.getNeighbors(currentZoneId);
      const ridersHere = availableRiders.filter(
        r => r.currentZoneId === currentZoneId
      );

      // If we find available riders at this node (not start zone since checked above)
      if (currentZoneId !== restaurantZoneId && ridersHere.length > 0) {
        selectedRider = ridersHere.sort((a, b) => b.rating - a.rating)[0];
        riderFoundAtZone = currentZoneId;

        steps.push({
          stepIndex: stepIndex++,
          currentNode: currentZoneId,
          queue: [...queue],
          visited: Array.from(visited),
          discoveredRiders: ridersHere,
          distanceMap: { ...distanceMap },
          predecessorMap: { ...predecessorMap },
          description: `TARGET FOUND! Located ${ridersHere.length} available rider(s) at Zone [${currentZoneId}]. Selecting top-rated rider [${selectedRider.name}] (Rating: ${selectedRider.rating}★).`
        });
        break;
      }

      // Explore neighbors
      for (const edge of neighbors) {
        if (!visited.has(edge.target)) {
          visited.add(edge.target);
          predecessorMap[edge.target] = currentZoneId;
          distanceMap[edge.target] =
            +(distanceMap[currentZoneId] + edge.distanceKm).toFixed(2);
          queue.push(edge.target);

          const ridersAtNeighbor = availableRiders.filter(
            r => r.currentZoneId === edge.target
          );

          steps.push({
            stepIndex: stepIndex++,
            currentNode: edge.target,
            queue: [...queue],
            visited: Array.from(visited),
            discoveredRiders: ridersAtNeighbor,
            distanceMap: { ...distanceMap },
            predecessorMap: { ...predecessorMap },
            description: `BFS Discovery: Traversed edge (${currentZoneId} -> ${edge.target}, +${edge.distanceKm} km). Cumulative Distance: ${distanceMap[edge.target]} km. Enqueued [${edge.target}].`
          });

          // Early termination on first level discovery if desired, or BFS queue pops it next
          if (ridersAtNeighbor.length > 0 && !selectedRider) {
            // We can continue to inspect queue or immediately pick
          }
        }
      }
    }

    // Reconstruct shortest path route from predecessor map
    const routePath: string[] = [];
    if (riderFoundAtZone) {
      let curr: string | null = riderFoundAtZone;
      while (curr !== null) {
        routePath.unshift(curr);
        curr = predecessorMap[curr] || null;
      }
    } else {
      routePath.push(restaurantZoneId);
    }

    const totalDistance = riderFoundAtZone
      ? distanceMap[riderFoundAtZone] || 0
      : 0;

    const endTime = performance.now();

    return {
      startZone: restaurantZoneId,
      assignedRider: selectedRider,
      riderFoundAtZone,
      distanceKm: totalDistance,
      traversedZones,
      routePath,
      steps,
      timeComplexity: 'O(V + E)',
      spaceComplexity: 'O(V)',
      executionTimeMs: +(endTime - startTime).toFixed(3)
    };
  }
}
