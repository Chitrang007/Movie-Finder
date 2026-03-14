# CMDB – Chitrang's Movie Database (CineStream)

CMDB (CineStream) is a React-based movie and TV show finder that lets you quickly search titles, explore featured picks, and maintain a personal watchlist stored in your browser.

It uses the public OMDb API to fetch detailed information including poster, year, plot, and IMDb rating.

---

## Features

- **Instant search**: Search for movies and series by title using the OMDb API.
- **Detailed results**: See posters, year of release, plot overview, and IMDb ratings for each result.
- **Featured picks**: Home screen shows curated titles like *Breaking Bad*, *Interstellar*, *The Dark Knight*, *Game of Thrones*, *Iron Man*, and *Loki*.
- **Watchlist (favorites)**:  
  - Add/remove items from your watchlist with a heart button.  
  - Watchlist count is visible in the navbar as **WatchList (N)**.  
  - A dedicated **My List** view shows only your saved titles.
- **Local persistence**: Favorites are stored in `localStorage` under the key `cine-favs`, so your watchlist survives page reloads.
- **Responsive UI**: Modern layout with custom styling and Bootstrap.

---

## Tech Stack

- **Frontend**: React (Create React App)
- **Styling**: CSS modules in `App.css`, `SearchBar.css`, and `Result.css` plus `bootstrap/dist/css/bootstrap.css`
- **Data Source**: [OMDb API](https://www.omdbapi.com/)
- **Build Tooling**: Create React App

---

## Getting Started

### Prerequisites

- **Node.js** (LTS recommended)
- **npm** (comes with Node)

You also need a free OMDb API key from [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx).

### Installation

# Clone the repository
git clone <your-repo-url>
cd Movie-Finder

# Install dependencies
npm install
