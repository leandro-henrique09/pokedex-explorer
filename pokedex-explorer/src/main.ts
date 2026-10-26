import './style.css'

interface Pokemon {
  name: string;
  url: string;
}

interface RespostaPokemons {
  results: Pokemon[]
}

interface Sprites {
  front_default: string;
}

interface TiposDePokemon {
  type: {name: string}
}

interface DetalhesPokemon {
  id: number;
  name: string;
  sprites: Sprites;
  types: TiposDePokemon[];
}

async function buscarPokemons() {
 try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
    if(!response.ok){
      throw new Error("Ocorreu um erro ao buscar os pokemons! "); 
    }
    const json:RespostaPokemons = await response.json();
    const listaDePokemon = document.querySelector('.lista-pokemons')

    const listaPokemons: Pokemon[] = json.results

    if (listaDePokemon) {
      for (const pokemon of listaPokemons) {
        const detalhesPokemon = await buscarDetalhesPokemon(pokemon.url)
        const imgPokemon = detalhesPokemon.sprites.front_default
        const idPokemon = detalhesPokemon.id
        const tipoPokemon = detalhesPokemon.types
        console.log(imgPokemon, idPokemon,tipoPokemon);
        listaDePokemon.appendChild(criaCardPokemon(pokemon))
      }
    } else {
      throw new Error("Ocorreu um erro na exibição de Pokemons.");
    }  
 } catch (error) {
    if(error instanceof Error) {
      console.log(`ERRO: ${error.message}`);
    }
 }
}

function criaCardPokemon(pokemon: Pokemon): HTMLDivElement {
  const divPokemon = document.createElement('div')
  const tituloPokemon = document.createElement('h2')
  tituloPokemon.textContent = pokemon.name

  divPokemon.appendChild(tituloPokemon);

  return divPokemon
}

async function buscarDetalhesPokemon(url: string): Promise<DetalhesPokemon> {
  const response = await fetch(url)
  if(!response.ok){
      throw new Error("Ocorreu um erro ao acessar a url."); 
    }
  const json:DetalhesPokemon = await response.json()
  
  return json
}

buscarPokemons();
buscarDetalhesPokemon('https://pokeapi.co/api/v2/pokemon/2/');