class PriorityQueue {
    constructor() {
      this.queue = [];
    }
  
    enqueue(node, priority) {
      this.queue.push({node, priority});
      this.sort();
    }
  
    dequeue() {
      if (this.isEmpty()) {
        return null;
      }
      return this.queue.shift();
    }
  
    sort() {
      this.queue.sort((a, b) => a.priority - b.priority);
    }
  
    isEmpty() {
      return this.queue.length === 0;
    }
  }
// FUNGSI USC
function ucs(graph, idx_from, idx_to){
    let queue = new PriorityQueue();
    queue.enqueue(idx_from, 0);
    let parrent = new Map();
    let path = []
    parrent.set(idx_from, null);
    let visited = [];
    // visited.add(idx_from);
    while(!queue.isEmpty()){
        let nodeNow = queue.dequeue();
        let cost = nodeNow.priority;
        node = nodeNow.node;
        if(!visited.includes(node)){
            if(node == idx_to){
                while(node != null){
                    // console.log(node);
                    path.push(node);
                    node = parrent.get(node);
                    // console.log(node);
                }
                path.reverse();
                return {path, cost};
            }
            else{
                for(let i = 0; i < graph.matrix[node].length; i++){
                    if(graph.matrix[node][i] != 0 && node != i && i != parrent.get(node)){
                      if(queue.nodeIsIn(i) != -1 && !visited.includes(i)){
                        let idx = queue.nodeIsIn(i)
                        if(queue.queue[idx].priority > cost + graph.matrix[node][i]){
                          parrent.delete(i)
                          // console.log(parrent)
                          queue.queue.splice(idx, 1);
                          queue.enqueue(i, cost + graph.matrix[node][i]);
                          parrent.set(i, node)
                          
                        }
                      }
                      else{
                        if(!visited.includes(i)){
                          queue.enqueue(i, cost + graph.matrix[node][i]);
                          parrent.set(i, node)
                        }
                      }
                      // // console.log("kontol")
                      // console.log(parrent.i + " " + node)
                    }
                }
                // console.log(parrent)
            }
            visited.push(node);
        }
        // console.log(visited)
    }
} 

// how to use ucss
// let graf = new Graph();
// graf.matrix = [
//   [0, 5, 3, 0],
//   [1, 0, 3, 4],
//   [3, 1, 0, 1],
//   [0, 4, 1, 0]]

// graf.node = [1,2,3,4]

// const result = ucs(graf, 0, 2); //{ path: [ 0, 2 ], cost: 3 }
// console.log(result); 