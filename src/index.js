//DEFINISI KELAS
class Node {
    // Membuat constructor dengan parameter name, lat, dan lon
    constructor(name, lat, lon) {
        // Menyimpan nilai parameter name ke dalam properti name
        this.name = name;
        // Menyimpan nilai parameter lat ke dalam properti lat
        this.lat = lat;
        // Menyimpan nilai parameter lon ke dalam properti lon
        this.lon = lon;
    }
    // Membuat method getLatitudeLongitude
    getLatitudeLongitude() {
        // Deklarasi array coordinates yang berisi nilai properti lat dan lon
        const coordinates = [this.lat, this.lon];
        // Mengembalikan array coordinates
        return coordinates;
    }
    // Membuat method findDistance dengan parameter node
    findDistance(node) {
        // Deklarasi variabel distance dan menghitung jarak antara 2 node dengan menggunakan function calculateDistance dan parameter properti lat dan lon
        const distance = calculateDistance(this.lat, this.lon, node.lat, node.lon);
        // Mengembalikan nilai distance
        return distance;
    }
}

class Graph {
    constructor() {
        this.nodes = [];
        this.adjacentMatrix = [];
        this.nodeAre = L.layerGroup([]);
        this.edgePaths = L.layerGroup([]);
        this.shortestPath = L.layerGroup([]);
    }
    // fungsi untuk mendapatkan node berdasarkan nama
    getNode(name) {
        return this.nodes.find(node => node.name === name);
    }
    // fungsi untuk menggambar marker node
    drawNodeMarker() {
        for (const node of this.nodes) {
            const circle = L.circle(node.getLatitudeLongitude(), {radius: 20});
            circle.bindPopup(node.name);
            this.nodeAre.addLayer(circle);
        }
    }
    // fungsi untuk menggambar jalur edge
    drawEdgePath() {
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = 0; j <= i; j++) {
                if (this.adjacentMatrix[i][j] > 0) {
                    const line = L.polyline([this.nodes[i].getLatitudeLongitude(), this.nodes[j].getLatitudeLongitude()]);
                    line.bindPopup(String(this.adjacentMatrix[i][j]));
                    line.setText(String(this.adjacentMatrix[i][j]), {center: true});

                    this.edgePaths.addLayer(line);
                }
            }
        }
    }
    // fungsi untuk menggambar jalur terpendek
    drawPath(path, map) {
        this.shortestPath.clearLayers();
        let sum = 0;
        for (let i = 0; i < path.length - 1; i++) {
            const from = this.getNode(path[i]);
            const to = this.getNode(path[i + 1]);
            const line = L.polyline([from.getLatitudeLongitude(), to.getLatitudeLongitude()], {color: 'red'});
            this.shortestPath.addLayer(line);
            this.shortestPath.addTo(map);

            sum += calculateDistance(from.lat, from.lon, to.lat, to.lon);
        }
        const textsum = document.getElementById("sum-path");
        textsum.innerHTML = "Shortest path's distance: " + sum.toString();
    }
    // fungsi untuk menggambar node dan edge pada peta
    draw(map) {
        this.drawNodeMarker();
        this.drawEdgePath();
        this.edgePaths.addTo(map);
        this.nodeAre.addTo(map);
    }
    // fungsi untuk membersihkan layer pada peta
    clear() {
        this.shortestPath.clearLayers();
        this.edgePaths.clearLayers();
        this.nodeAre.clearLayers();
    }
    // fungsi untuk mendapatkan indeks node berdasarkan nama
    getIndex(name) {
        return this.nodes.findIndex(x => x.name === name);
    }
}

//DEFINISI FUNGSI HELPER
// Membuat fungsi calculateDistance dengan parameter latitude1, longitude1, latitude2, dan longitude2
function calculateDistance(latitude1, longitude1, latitude2, longitude2) {
    // Menetapkan konstanta R dengan nilai 6371 yang merupakan radius bumi dalam km
    const R = 6371;
    // Mengubah perbedaan latitude menjadi radian dan menyimpannya dalam variabel _latitude
    const _latitude = derajatToRadian(latitude2 - latitude1);
    // Mengubah perbedaan longitude menjadi radian dan menyimpannya dalam variabel _longitude
    const _longitude = derajatToRadian(longitude2 - longitude1); 
    // Menghitung nilai a menggunakan rumus haversine formula
    const a = Math.sin(_latitude / 2) * Math.sin(_latitude / 2) +
              Math.cos(derajatToRadian(latitude1)) * Math.cos(derajatToRadian(latitude2)) * 
              Math.sin(_longitude / 2) * Math.sin(_longitude / 2); 
    // Menghitung nilai c menggunakan rumus haversine formula
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    // Menghitung nilai d (jarak) menggunakan rumus haversine formula dan radius bumi R
    const d = R * c;
    // Mengembalikan nilai d (jarak)
    return d;
}

// Membuat fungsi derajatToRadian dengan parameter degree
function derajatToRadian(degree) {
    // Menghitung nilai radian dengan rumus degree * Math.PI / 180
    const radian = degree * Math.PI / 180;
    // Mengembalikan nilai radian
    return radian;
}

// fungsi yang akan dijalankan ketika pengguna mengklik peta
function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

//VARIABEL GLOBAL
// Inisialisasi peta dengan koordinat tertentu
let map = L.map('mapid').setView([-6.889295, 107.610365], 17);
// Membuat objek Graph baru
const graph = new Graph();
// Menambahkan tile layer pada peta
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
// Menambahkan marker pada peta
L.marker([-6.889295, 107.610365]).addTo(map)
    .bindPopup('ITB')
    .openPopup();
    
// Fungsi untuk membaca dataset
const readDataset = (event) => {
    // Buat objek FileReader
    let dataset = new FileReader();
    // Ketika FileReader selesai membaca dataset
    dataset.onload = function(event){
        // Parsing data dari format JSON ke objek JavaScript
        var data = JSON.parse(event.target.result);
        // Panggil fungsi main dengan parameter nodes dan edges dari data
        main(data.nodes, data.edges);
    };
    // Baca file dataset yang diupload oleh pengguna
    dataset.readAsText(event.target.files[0]);
}

// Fungsi untuk menampilkan jalur terpendek antara dua node.
const main = (nodes, edges) => {
    // Menghapus semua node dan edge yang ada pada peta.
    graph.clear();
    // Menghapus elemen pada dropdown list dari node asal dan tujuan.
    let from = document.getElementById("from-node");
    let goal = document.getElementById("to-node");
    let i=0;
    if (from.length != 0 || goal.length!=0){
        while(from.length!=0 && goal.length!=0){
            from.remove(from.i);
            goal.remove(goal.i);
            i++;
        }
    }
    // Inisialisasi array untuk menyimpan node-node dari graf.
    let nodeArr = [];
    for (let node of nodes) {
        let tnode = new Node(node.name, node.lat, node.lon);
        nodeArr.push(tnode);
    }
    // Tambahkan elemen pada dropdown list untuk node asal dan tujuan.
    for (let node of nodes){
        let elmtfrom = document.createElement("option");
        let elmtto = document.createElement("option");
        elmtfrom.text = node.name;
        elmtto.text = node.name;
        document.getElementById("from-node").add(elmtfrom);
        document.getElementById("to-node").add(elmtto);
    }
    // Set node-node pada graf.
    graph.nodes = nodeArr;
    // Inisialisasi matriks adjacency untuk graf.
    let matrix = [];
    for(let i=0; i<nodeArr.length; i++){
        matrix[i] = [];
        for(let j=0; j<nodeArr.length; j++){
            matrix[i][j] = 0;
        }
    }
    // Mengisi nilai pada matriks adjacency dengan jarak antar node.
    for (let edge of edges){
        var idx = 0;
        let idx_from_found = false;
        let idx_to_found = false;
        var idx_from=-1;
        var idx_to=-1;
        while (idx < nodeArr.length && (!idx_from_found || !idx_to_found)){
            // Cari index dari node asal pada array nodeArr.
            if (edge.from == nodeArr[idx].name && !idx_from_found){
                idx_from = idx;
                idx_from_found = true;
            } 
            // Cari index dari node tujuan pada array nodeArr.
            if (edge.to == nodeArr[idx].name && !idx_to_found){
                idx_to = idx;
                idx_to_found = true;
            }
            idx++;
        }
        let dist = calculateDistance(nodeArr[idx_from].lat, nodeArr[idx_from].lon, nodeArr[idx_to].lat, nodeArr[idx_to].lon);
        matrix[idx_from][idx_to] = dist.toPrecision(4);
        matrix[idx_to][idx_from] = dist.toPrecision(4);
    }
    // Set matriks adjacency pada graf dan tampilkan pada peta.
    graph.adjacentMatrix = matrix;
    graph.draw(map);
}

// FUNGSI UCS
class PriorityQueue {
    constructor() {
      this.queue = [];
    }
  
    enqueue(node, priority) {
      this.queue.push({node, priority});
      this.sort();
    }
    nodeIsIn(node){
        for(let i = 0; i < this.queue.length; i++){
          if(this.queue[i].node === node){
            return i;
          }
        }
        return -1;
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
function ucs(){
    let fromnode = document.getElementById("from-node");
    let goalnode = document.getElementById("to-node");
    let startname = fromnode.options[fromnode.selectedIndex].text;
    let goalname = goalnode.options[goalnode.selectedIndex].text;
    let startNode = graph.nodes[graph.getIndex(startname)]
    let endNode = graph.nodes[graph.getIndex(goalname)]
    // let idx_from = graph.getIndex(fromnode.name);
    // let idx_to = graph.getIndex(goalnode.name);
    let queue = new PriorityQueue();
    queue.enqueue(startNode, 0);
    let parrent = new Map();
    let path = []
    parrent.set(startNode, null);
    let visited = [];
    // visited.add(idx_from);
    while(!queue.isEmpty()){
        let nodeNow = queue.dequeue();
        let cost = nodeNow.priority;
        // console.log(cost);
        let node = nodeNow.node;
        if(!visited.includes(node)){
            if(node == endNode){
                while(node != null){
                    // console.log(node);
                    path.push(node.name);
                    node = parrent.get(node);
                    // console.log(node);
                }
                path.reverse();
                graph.drawPath(path, map);
                return path;
            }
            else{
                for(let i = 0; i < graph.adjacentMatrix[graph.getIndex(node.name)].length; i++){
                    if(graph.adjacentMatrix[graph.getIndex(node.name)][i] != 0 && node != graph.nodes[i] && graph.nodes[i] != parrent.get(node)){
                      if(queue.nodeIsIn(graph.nodes[i]) != -1 && !visited.includes(i)){
                        let idx = queue.nodeIsIn(graph.nodes[i])
                        console.log(idx)
                        if(queue.queue[idx].priority > (cost + graph.adjacentMatrix[graph.getIndex(node.name)][i])){
                          parrent.delete(graph.nodes[i])
                          // console.log(parrent)
                          queue.queue.splice(idx, 1);
                          queue.enqueue(graph.nodes[i], cost + graph.adjacentMatrix[graph.getIndex(node.name)][i]);
                          parrent.set(graph.nodes[i], node)
                          
                        }
                      }
                      else{
                        if(!visited.includes(graph.nodes[i])){
                          queue.enqueue(graph.nodes[i], cost + graph.adjacentMatrix[graph.getIndex(node.name)][i]);
                          parrent.set(graph.nodes[i], node)
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

// FUNGSI A*
function Astar() {
    // Deklarasi variabel
    let fromnode = document.getElementById("from-node");
    let goalnode = document.getElementById("to-node");
    let startname = fromnode.options[fromnode.selectedIndex].text;
    let goal = goalnode.options[goalnode.selectedIndex].text;
    let unvisited = [];
    let start = {
        name: startname,
        prev: null,
        fValue: undefined,
        cost: undefined
    };
    // Memanggil fungsi Astaralgorithm untuk mencari jalur terpendek
    let path = Astaralgorithm(start, goal, 0, unvisited);
    // Memutar urutan jalur
    path.reverse();
    // Menggambar jalur pada peta
    graph.drawPath(path, map);
    // Mengembalikan jalur terpendek
    return path;
}

function Astaralgorithm(current, goal, gValue, unvisited) {
    // Jika node yang sedang diperiksa adalah node tujuan, maka kembalikan jalur yang telah ditemukan
    if (current.name == goal) {
        let path = [];
        while (current != null) {
            path.push(current.name);
            current = current.prev;
        }
        return path;
    }
    // Mencari indeks node saat ini di dalam graph
    let currIdx = graph.getIndex(current.name);
    // Memasukkan node yang terhubung dengan node saat ini ke dalam array unvisited
    for (let i = 0; i < graph.nodes.length; i++) {
        if (graph.adjacentMatrix[currIdx][i] > 0) {
            let toVisit = {};
            toVisit.name = graph.nodes[i].name;
            toVisit.prev = current;
            toVisit.cost = Number(graph.adjacentMatrix[currIdx][i]);

            // Menghitung fValue, yaitu perkiraan jarak terpendek dari node saat ini ke node tujuan melalui node yang sedang dipertimbangkan
            toVisit.fValue = Number(graph.nodes[i].findDistance(graph.getNode(goal))) + Number(gValue) + Number(graph.adjacentMatrix[currIdx][i]);
            unvisited.push(toVisit);
        }
    }
    // Mencari node selanjutnya dengan fValue terkecil
    let minIdx = 0;
    for (let i = 1; i < unvisited.length; i++) {
        if (unvisited[i].fValue < unvisited[minIdx].fValue) {
            minIdx = i;
        }
    }
    // Mengambil node selanjutnya dan menghitung nilai gValue yang baru
    let next = unvisited.splice(minIdx, 1);
    let newG = gValue+next[0].cost;
    // Melakukan rekursi untuk mencari jalur terpendek dari node selanjutnya ke node tujuan
    return Astaralgorithm(next[0], goal, newG, unvisited);
}

function runAlgorithm() {
    // Mendapatkan nilai dropdown "algorithm"
    const algorithm = document.getElementById("algorithm").value;
    // Jika nilai dropdown "algorithm" adalah "astar", jalankan algoritma A*
    if (algorithm === "astar") {
        Astar();
    }
    // Jika nilai dropdown "algorithm" adalah "ucs", jalankan algoritma UCS
    else if (algorithm === "ucs") {
        ucs();
    }
}