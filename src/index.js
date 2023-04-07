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
        this.nodeArea = L.layerGroup([]);
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
            this.nodeArea.addLayer(circle);
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
        this.nodeArea.addTo(map);
    }
    // fungsi untuk membersihkan layer pada peta
    clear() {
        this.shortestPath.clearLayers();
        this.edgePaths.clearLayers();
        this.nodeArea.clearLayers();
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

// fungsi yang akan dijalankan ketika pengguna mengklik peta
function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

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

const main = (nodes, edges) => {
    // membersihkan data pada graph
    graph.clear();
    // mendapatkan elemen select untuk asal dan tujuan
    let from = document.getElementById("from-node");
    let goal = document.getElementById("to-node");
    // menghapus opsi pada elemen select jika sudah ada
    if (from.length != 0 || goal.length!=0){
        while(from.length!=0 && goal.length!=0){
            from.remove(from.i);
            goal.remove(goal.i);
            i++;
        }
    }
    
    // membuat node dari dataset dan menyimpannya dalam array nodeArr
    let nodeArr = [];
    for (let node of nodes) {
        let tnode = new Node(node.name, node.lat, node.lon);
        nodeArr.push(tnode);
    }

    // membuat opsi pada elemen select untuk asal dan tujuan
    for (let node of nodes){
        let elmtfrom = document.createElement("option");
        let elmtto = document.createElement("option");
        elmtfrom.text = node.name;
        elmtto.text = node.name;
        document.getElementById("from-node").add(elmtfrom);
        document.getElementById("to-node").add(elmtto);
    }
    // menyimpan array nodeArr ke dalam graph
    graph.nodes = nodeArr;
    // membuat matriks adjacency yang merepresentasikan jarak antara node-node
    let matrix = [];
    for(let i=0; i<nodeArr.length; i++){
        matrix[i] = [];
        for(let j=0; j<nodeArr.length; j++){
            matrix[i][j] = 0;
        }
    }
    for (let edge of edges){
        var idx = 0;
        let idx_from_found = false;
        let idx_to_found = false;
        var idx_from=-1;
        var idx_to=-1;
        // mencari node dari setiap ujung edge pada nodeArr
        while (idx < nodeArr.length && (!idx_from_found || !idx_to_found)){
            if (edge.from == nodeArr[idx].name && !idx_from_found){
                idx_from = idx;
                idx_from_found = true;
            } 
            if (edge.to == nodeArr[idx].name && !idx_to_found){
                idx_to = idx;
                idx_to_found = true;
            }
            idx++;
        }
        // menghitung jarak antara dua node dan menyimpannya pada matriks adjacency
        let dist = calculateDistance(nodeArr[idx_from].lat, nodeArr[idx_from].lon, nodeArr[idx_to].lat, nodeArr[idx_to].lon);
        matrix[idx_from][idx_to] = dist.toPrecision(4);
        matrix[idx_to][idx_from] = dist.toPrecision(4);
    }
    // menyimpan matriks adjacency pada graph dan menggambar graph pada map
    graph.adjacentMatrix = matrix;
    graph.draw(map);
}

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
// FUNGSI A*