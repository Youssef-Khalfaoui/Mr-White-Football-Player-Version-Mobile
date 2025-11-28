const API_KEY = '7e676ed28e1f978d2c7d9cdddcee7030';
const BASE_URL = 'https://v3.football.api-sports.io';

let recentlyUsedIds = [];

const fetchRandomPlayersFromLeague = async () => {
  const topLeagues = [39, 140, 135, 78, 61];
  const randomLeague = topLeagues[Math.floor(Math.random() * topLeagues.length)];
  const randomPage = Math.floor(Math.random() * 10) + 1;
  
  try {
    const response = await fetch(
      `${BASE_URL}/players?league=${randomLeague}&season=2023&page=${randomPage}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'v3.football.api-sports.io',
          'x-rapidapi-key': API_KEY
        }
      }
    );

    const data = await response.json();
    
    if (data.response && data.response.length > 0) {
      const validPlayers = data.response.filter(p => 
        p.player.photo && 
        !p.player.photo.includes('placeholder') &&
        !recentlyUsedIds.includes(p.player.id)
      );
      
      return validPlayers.map(p => ({
        id: p.player.id,
        name: p.player.name,
        team: p.statistics[0]?.team?.name || 'Unknown',
        country: p.player.nationality,
        image: p.player.photo,
        age: p.player.age,
        position: p.statistics[0]?.games?.position || 'Unknown'
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching players from league:', error);
    return [];
  }
};

export const fetchTwoRandomPlayers = async () => {
  console.log('Fetching random players from API...');
  
  let players = await fetchRandomPlayersFromLeague();
  
  if (players.length < 2) {
    players = await fetchRandomPlayersFromLeague();
  }
  
  if (players.length < 2) {
    throw new Error('Failed to fetch enough players from API');
  }
  
  const shuffled = players.sort(() => Math.random() - 0.5);
  const principal = shuffled[0];
  const secondary = shuffled[Math.floor(Math.random() * (shuffled.length - 1)) + 1] || shuffled[1];
  
  recentlyUsedIds.push(principal.id, secondary.id);
  if (recentlyUsedIds.length > 20) {
    recentlyUsedIds = recentlyUsedIds.slice(-20);
  }
  
  console.log('Fetched players:', principal.name, 'vs', secondary.name);
  
  return {
    principal,
    secondary
  };
};
