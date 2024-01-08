package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

func main() {
	Routers()
}

func Routers() {
	InitDB()
	defer db.Close()
	log.Println("Starting the HTTP server on port 9080")
	router := mux.NewRouter()
	router.HandleFunc("/inventory",
		GetInventoryItems).Methods("GET")
	router.HandleFunc("/inventory",
		CreateInventoryItem).Methods("POST")
	router.HandleFunc("/inventory/{id}",
		GetInventoryItemByID).Methods("GET")
	router.HandleFunc("/inventory/{id}",
		UpdateInventoryItem).Methods("PUT")
	router.HandleFunc("/inventory/{id}",
		DeleteInventoryItem).Methods("DELETE")
	http.ListenAndServe(":9080",
		&CORSRouterDecorator{router})
}

// GetInventoryItems mengembalikan daftar semua barang
func GetInventoryItems(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Query semua item inventaris dari database
	rows, err := db.Query("SELECT id, nama_barang, jumlah, harga_satuan, lokasi, deskripsi FROM inventory_farrelsetiapratama")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var inventoryItems []InventoryItem
	for rows.Next() {
		var item InventoryItem
		err := rows.Scan(&item.ID, &item.NamaBarang, &item.Jumlah, &item.HargaSatuan, &item.Lokasi, &item.Deskripsi)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		inventoryItems = append(inventoryItems, item)
	}

	// Respond dengan daftar barang
	json.NewEncoder(w).Encode(inventoryItems)
}

// AddInventoryItem menangani permintaan POST untuk menambahkan item inventaris
func CreateInventoryItem(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var newItem InventoryItem
	err := json.NewDecoder(r.Body).Decode(&newItem)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Insert newItem into the database (use prepared statement)
	stmt, err := db.Prepare("INSERT INTO inventory_farrelsetiapratama (nama_barang, jumlah, harga_satuan, lokasi, deskripsi) VALUES (?, ?, ?, ?, ?)")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(newItem.NamaBarang, newItem.Jumlah, newItem.HargaSatuan, newItem.Lokasi, newItem.Deskripsi)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond with success
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(newItem)
}

// GetInventoryItemByID mengembalikan item inventaris berdasarkan ID
func GetInventoryItemByID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Ambil ID dari variabel URL
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Handle request method
	switch r.Method {
	case http.MethodGet:
		// Query item inventaris dari database berdasarkan ID
		row := db.QueryRow("SELECT id, nama_barang, jumlah, harga_satuan, lokasi, deskripsi FROM inventory_farrelsetiapratama WHERE id=?", id)

		var item InventoryItem
		err = row.Scan(&item.ID, &item.NamaBarang, &item.Jumlah, &item.HargaSatuan, &item.Lokasi, &item.Deskripsi)
		if err == sql.ErrNoRows {
			// Item tidak ditemukan
			http.Error(w, "Item not found", http.StatusNotFound)
			return
		} else if err != nil {
			// Terjadi kesalahan lain
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Respond dengan item inventaris
		json.NewEncoder(w).Encode(item)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// UpdateInventoryItem menangani permintaan PUT untuk memperbarui item inventaris
func UpdateInventoryItem(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Ambil ID dari variabel URL
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var updatedItem InventoryItem
	err = json.NewDecoder(r.Body).Decode(&updatedItem)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validasi data yang diterima
	if updatedItem.ID != id {
		http.Error(w, "ID mismatch", http.StatusBadRequest)
		return
	}

	// Update item dalam database (gunakan prepared statement)
	stmt, err := db.Prepare("UPDATE inventory_farrelsetiapratama SET nama_barang=?, jumlah=?, harga_satuan=?, lokasi=?, deskripsi=? WHERE id=?")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(updatedItem.NamaBarang, updatedItem.Jumlah, updatedItem.HargaSatuan, updatedItem.Lokasi, updatedItem.Deskripsi, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond dengan sukses
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(updatedItem)
}

// DeleteInventoryItem menangani permintaan DELETE untuk menghapus item inventaris
func DeleteInventoryItem(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Ambil ID dari variabel URL
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Hapus item dari database
	_, err = db.Exec("DELETE FROM inventory_farrelsetiapratama WHERE id=?", id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Respond dengan sukses
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Item deleted"})
}

type InventoryItem struct {
	ID          int     `json:"id"`
	NamaBarang  string  `json:"nama_barang"`
	Jumlah      int     `json:"jumlah"`
	HargaSatuan float64 `json:"harga_satuan"`
	Lokasi      string  `json:"lokasi"`
	Deskripsi   string  `json:"deskripsi"`
}

var db *sql.DB
var err error

func InitDB() {
	db, err = sql.Open("mysql",
		"root:@/db_2205477_farrelsetiapratama_uas")
	if err != nil {
		panic(err.Error())
	}

	log.Println("Database Connected")
}

type CORSRouterDecorator struct {
	R *mux.Router
}

func (c *CORSRouterDecorator) ServeHTTP(rw http.ResponseWriter,
	req *http.Request) {
	if origin := req.Header.Get("Origin"); origin != "" {
		rw.Header().Set("Access-Control-Allow-Origin", origin)
		rw.Header().Set("Access-Control-Allow-Methods",
			"POST, GET, OPTIONS, PUT, DELETE")
		rw.Header().Set("Access-Control-Allow-Headers",
			"Accept, Accept-Language,"+
				" Content-Type, YourOwnHeader")
	}
	// Stop here if its Preflighted OPTIONS request
	if req.Method == "OPTIONS" {
		return
	}

	c.R.ServeHTTP(rw, req)
}
