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
	// Look for the .env in the parent directory (MOVIE-FINDER root)
	err := godotenv.Load("../.env")
	if err != nil {
		fmt.Println("Warning: Could not find .env in parent folder, checking local...")
		godotenv.Load() // Fallback to local
	}

	// Use the exact variable name from your current .env
	apiKey := os.Getenv("REACT_APP_TMDB_API_KEY")
	if apiKey == "" {
		log.Fatal("TMDB Key not found in .env. Check your variable name!")
	}

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		proxyHandler(w, r, apiKey)
	})

	fmt.Println("🚀 Go Proxy Tunnel active on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func proxyHandler(w http.ResponseWriter, r *http.Request, apiKey string) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == "OPTIONS" {
		return
	}

	var targetURL string
	if strings.HasPrefix(r.URL.Path, "/image") {
		imagePath := strings.TrimPrefix(r.URL.Path, "/image")
		targetURL = "https://image.tmdb.org/t/p" + imagePath
	} else {
		// Append the API key to every request automatically
		targetURL = fmt.Sprintf("https://api.themoviedb.org/3%s?api_key=%s", r.URL.Path, apiKey)
		if r.URL.RawQuery != "" {
			targetURL += "&" + r.URL.RawQuery
		}
	}

	resp, err := http.Get(targetURL)
	if err != nil {
		http.Error(w, "Proxy Error", http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	for k, v := range resp.Header {
		w.Header()[k] = v
	}
	w.WriteHeader(resp.StatusCode)
	io.Copy(w, resp.Body)
}
