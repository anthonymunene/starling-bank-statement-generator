async function main(args) {
  try {
    const url = `https://openlibrary.org/search.json?q=harry+potter`;
    const harryPotterBooks = await fetch(url)
    const results = await harryPotterBooks.json();

    const titles = results?.docs.map(result => result.title)
    const uniqueTitles = [...new Set(titles)]
    console.log(uniqueTitles);
  } catch (error) {
    console.log(error);
  }
}

main();
