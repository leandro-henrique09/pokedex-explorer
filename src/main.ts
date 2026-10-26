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
        const promessas = listaPokemons.map(pokemon =>
          buscarDetalhesPokemon(pokemon.url)
        );

        const detalhesPokemon = await Promise.all(promessas)

        for (const pokemon of detalhesPokemon) {
          const imgPokemon = pokemon.sprites.front_default
          const idPokemon = pokemon.id
          const tipoPokemon = pokemon.types
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

function criaCardPokemon(pokemon: DetalhesPokemon): HTMLDivElement {
  const divPokemon = document.createElement('div')
  const imgPokemon = document.createElement('img')
  const idPokemon = document.createElement('p')
  const tituloPokemon = document.createElement('h2')
  const tiposPokemon = document.createElement('p')

  divPokemon.className = 'card-pokemon'
  imgPokemon.className = 'imagem-pokemon'
  idPokemon.className = 'numero-pokemon'
  tituloPokemon.className = 'nome-pokemon'
  tiposPokemon.className = 'tipos-pokemon'

  pokemon.types.forEach(tipo => {
    tiposPokemon.textContent += ` ${tipo.type.name}`
  })
  idPokemon.textContent = String(pokemon.id).padStart(3, '0');
  imgPokemon.src = pokemon.sprites.front_default
  tituloPokemon.textContent = pokemon.name

  divPokemon.appendChild(idPokemon)
  divPokemon.appendChild(tituloPokemon)
  divPokemon.appendChild(imgPokemon)
  divPokemon.appendChild(tiposPokemon)

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