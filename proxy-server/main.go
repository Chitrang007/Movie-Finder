package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

func main() {
	// 1. Load Environment Variables
	err := godotenv.Load("../.env")
	if err != nil {
		fmt.Println("Warning: Could not find .env in parent folder, checking local...")
		godotenv.Load()
	}

	tmdbKey := os.Getenv("REACT_APP_TMDB_API_KEY")
	omdbKey := os.Getenv("REACT_APP_OMDB_API_KEY")

	if tmdbKey == "" || omdbKey == "" {
		log.Fatal("API Keys missing in .env! Ensure both TMDB and OMDB keys are set.")
	}

	// 2. Setup Routes
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		proxyHandler(w, r, tmdbKey, omdbKey)
	})

	fmt.Println("🚀 Discovery Bureau Proxy active on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func proxyHandler(w http.ResponseWriter, r *http.Request, tmdbKey string, omdbKey string) {
	// CORS Headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		return
	}

	var targetURL string

	// 3. Routing Logic
	if strings.HasPrefix(r.URL.Path, "/omdb") {
		// --- OMDB TUNNEL ---
		// Expects frontend to call: http://localhost:8080/omdb?t=Inception
		targetURL = fmt.Sprintf("https://www.omdbapi.com/?apikey=%s", omdbKey)
		if r.URL.RawQuery != "" {
			targetURL += "&" + r.URL.RawQuery
		}

	} else if strings.HasPrefix(r.URL.Path, "/image") {
		// --- TMDB IMAGE TUNNEL ---
		imagePath := strings.TrimPrefix(r.URL.Path, "/image")
		targetURL = "https://image.tmdb.org/t/p" + imagePath

	} else {
		// --- TMDB API TUNNEL (Default) ---
		targetURL = fmt.Sprintf("https://api.themoviedb.org/3%s?api_key=%s", r.URL.Path, tmdbKey)
		if r.URL.RawQuery != "" {
			targetURL += "&" + r.URL.RawQuery
		}
	}

	// 4. Execute the Request
	resp, err := http.Get(targetURL)
	if err != nil {
		http.Error(w, "Proxy Error", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	// Copy headers and body back to frontend
	for k, v := range resp.Header {
		w.Header()[k] = v
	}
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}
