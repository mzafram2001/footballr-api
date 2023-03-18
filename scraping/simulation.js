function simularPartido(nombreEquipo1, jugadoresEquipo1, nombreEquipo2, jugadoresEquipo2) {

    const golesEquipo1 = [];
    const golesEquipo2 = [];

    for (let i = 0; i < 90; i++) {
        const minuto = i + 1;

        // Generamos un número aleatorio para determinar si se marca un gol
        const golEquipo1 = Math.random() < 0.015;
        const golEquipo2 = Math.random() < 0.015;

        // Si se marca un gol, elegimos un jugador al azar
        if (golEquipo1) {
            let jugador = jugadoresEquipo1[Math.floor(Math.random() * jugadoresEquipo1.length)];
            while (jugador == jugadoresEquipo1[0]) {
                jugador = jugadoresEquipo1[Math.floor(Math.random() * jugadoresEquipo1.length)];
            }
            golesEquipo1.push({ minuto, jugador });
        }
        if (golEquipo2) {
            let jugador = jugadoresEquipo2[Math.floor(Math.random() * jugadoresEquipo2.length)];
            while (jugador == jugadoresEquipo2[0]) {
                jugador = jugadoresEquipo2[Math.floor(Math.random() * jugadoresEquipo2.length)];
            }
            golesEquipo2.push({ minuto, jugador });
        }
    }

    console.log(`Resultado final: ${nombreEquipo1} ${golesEquipo1.length} - ${golesEquipo2.length} ${nombreEquipo2}`);

    console.log(`Goles ${nombreEquipo1}:`);
    golesEquipo1.forEach(gol => console.log(`${gol.minuto} - ${gol.jugador}`));

    console.log(`Goles ${nombreEquipo2}:`);
    golesEquipo2.forEach(gol => console.log(`${gol.minuto} - ${gol.jugador}`));

}

// Ejemplo de uso
const equipo1 = "Real Madrid";
const jugadoresEquipo1 = ["Courtois", "Carvajal", "Varane", "Ramos", "Marcelo", "Kroos", "Modric", "Casemiro", "Asensio", "Benzema", "Vinicius"];
const equipo2 = "Barcelona";
const jugadoresEquipo2 = ["Ter Stegen", "Dest", "Piqué", "Lenglet", "Jordi Alba", "Busquets", "De Jong", "Pedri", "Messi", "Griezmann", "Dembele"];

simularPartido(equipo1, jugadoresEquipo1, equipo2, jugadoresEquipo2);