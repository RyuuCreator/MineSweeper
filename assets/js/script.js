let target = document.getElementById("inputPersContent");
target.style.display = "none";

let  togglePers = function() {    
    if (target.style.display === "none") {
        target.style.display = "block";
    } else {
        target.style.display = "none";
    }
}

let targetRules = document.getElementById("modalRules");
targetRules.style.display = "none";

let toggleRules = function() {
    if (targetRules.style.display === "none") {
        targetRules.style.display = "block";
    } else {
        targetRules.style.display = "none";
    }
}

let tester = 0
let temps
let startTimer 
let test
const timerElement = document.getElementById('nbTimesTotal');

let MineSweeper = {
    name: 'MineSweeper',
    difficulties: {
        easy: {
            name: "Facile",
            lines: 8,
            columns: 8,
            mines: 10,
        },
        normal: {
            name: "Normal",
            lines: 16,
            columns: 16,
            mines: 40,
        },
        hard: {
            name: "Difficile",
            lines: 16,
            columns: 32,
            mines: 100,
        },
        extreme: {
            name: "Extrème",
            lines: 32,
            columns: 32,
            mines: 130,
        },
        personalized: {
            name: "Personnalisée",
            lines: '',
            columns: '',
            mines: '',
        }
    },
    settings: {

    },
    game: {
        status: 0,
        field: new Array(),
    },
    initialize: function() {
        this.startGame('easy');
    },
    startGame: function(difficulty) {
        this.settings = this.difficulties[difficulty];
        document.getElementById('nbMinesTotal').innerHTML = this.difficulties[difficulty].mines;
        document.getElementById('gameDifficulty').innerHTML = this.difficulties[difficulty].name;

        this.timer()
        this.drawGameBoard();
        this.resetTimer()
        this.resetGame();
    },
    timer: function() {
        temps = 0

        let upTimer = function() {
            if (tester === 0) {
                let minutes = parseInt(temps / 60, 10)
                let secondes = parseInt(temps % 60, 10)

                minutes = minutes < 10 ? "0" + minutes : minutes
                secondes = secondes < 10 ? "0" + secondes : secondes

                timerElement.innerHTML = `${minutes}:${secondes}`
                temps++
            } else {
                clearInterval(startTimer)
                test = false
            }
        }

        test = false
        const board = document.getElementById('plateau');

        board.addEventListener('click', () => {
            if(test === false) {
                upTimer()
                startTimer = setInterval(upTimer, 1000);
                test = true
            }
        })
    },
    resetTimer: function() {
        tester = 0
        test = false
        clearInterval(startTimer)
        timerElement.innerHTML = "00:00"
    },
    drawGameBoard: function() {
        const board = document.getElementById('plateau');
        board.innerHTML = '';

        document.getElementById('result').innerHTML = '';

        const border = document.createElement('table');
        border.setAttribute('oncontextmenu', 'return false;');
        const field = document.createElement('tbody');
        border.appendChild(field);
        border.className = 'field';

        board.appendChild(border);

        for(let i = 1; i <= this.settings['lines']; i++) {
            const line = document.createElement('tr');

            for(let j = 1; j <= this.settings['columns']; j++) {
                const cell = document.createElement('td');
                cell.id = 'cell-' + i + '-' + j;
                cell.className = 'cell';
                cell.setAttribute('onclick', this.name + '.checkPosition(' + i + ',' + j +', true);');
                cell.setAttribute('oncontextmenu', this.name + '.markPosition(' + i + ',' + j + '); return false');
                line.appendChild(cell);
            }
            field.appendChild(line);
        }

        
    },
    personalized: function() {
        let nbCols = document.getElementById('persColumns').value
        let nbRows = document.getElementById('persRows').value
        let nbMines = document.getElementById('persMines').value

        if ((nbRows && nbCols) > 50) {
            alert("Grandeur limitée à 50x50 pour le moment.")
        } else {
            if ( nbMines > nbCols*nbRows/2) {
                alert('Le nombre de mines dépasse la moitié du nombre d\'emplacements')
            } else {
                this.difficulties.personalized.lines = parseInt(nbRows)
                this.difficulties.personalized.columns = parseInt(nbCols)
                this.difficulties.personalized.mines = parseInt(nbMines)

                this.startGame('personalized')
            }
        }
    },
    resetGame: function() {
        this.game.field = new Array();
        for (let i = 1; i <= this.settings['lines']; i++) {
            this.game.field[i] = new Array();
            for (let j = 1; j <= this.settings['columns']; j++) {
                this.game.field[i][j] = 0;
            }
        }

        for (let i = 1; i <= this.settings['mines']; i++) {
            let x = Math.floor(Math.random() * (this.settings['lines'] - 1) + 1);
            let y = Math.floor(Math.random() * (this.settings['columns'] - 1) + 1);

            while (this.game.field[x][y] == -1) {
                x = Math.floor(Math.random() * (this.settings['lines'] - 1) + 1);
                y = Math.floor(Math.random() * (this.settings['columns'] - 1) + 1);
            }

            this.game.field[x][y] = -1;

            for (let j = x-1; j <= x+1; j++) {
                if (j == 0 || j == (this.settings['lines'] + 1)) {
                    continue;
                }

                for (let k = y-1; k <= y+1; k++) {
                    if (k == 0 || k == (this.settings['columns'] + 1)) {
                        continue;
                    }
                    if (this.game.field[j][k] != -1) {
                        this.game.field[j][k] ++;
                    }
                }
            }
        }

        document.getElementById('result').style.display = 'none';

        this.game.status = 1;
    },
    checkPosition: function (x, y, check) {
        if (this.game.status != 1) {
            return;
        }

        if (this.game.field[x][y] == -2) {
            return;
        }

        if (this.game.field[x][y] < -90) {
            return;
        }

        if (this.game.field[x][y] == -1) {
            document.getElementById('cell-' + x + '-' + y).className = 'cell bomb';
            document.getElementById('cell-' + x + '-' + y).innerHTML = '💣'; 

            this.displayLose();
            return;
        }

        document.getElementById('cell-' + x + '-' + y).className = 'cell clear';

        if (this.game.field[x][y] > 0) {
            document.getElementById('cell-' + x + '-' + y).innerHTML = this.game.field[x][y];
            this.game.field[x][y] = -2;
        } else if (this.game.field[x][y] == 0) {
            this.game.field[x][y] = -2;
            
            for (let j = x-1; j <= x+1; j++) {
                if (j == 0 || j == (this.settings['lines'] + 1)) {
                    continue;
                }
                for (let k = y-1; k <= y+1; k++) {
                    if (k == 0 || k == (this.settings['columns'] + 1)) {
                        continue;
                    }

                    if (this.game.field[j][k] === undefined) {
                        console.log("Marche J : " + this.game.field[j]);
                        console.log("Marche K : " + this.game.field[k]);
                    }

                    if( this.game.field[j][k] > -1) {
                        this.checkPosition(j, k, false);
                    }
                }
            }
        }

        if (check !== false) {
            this.checkWin();
        }
    },
    markPosition: function (x, y) {
        
        if (this.game.status != 1) {
            return;
        }

        if (this.game.field[x][y] == -2) {
            return;
        }

        if (this.game.field[x][y] < -90 && (document.getElementById('cell-' + x + '-' + y).innerHTML != '🚩')) {
            document.getElementById('cell-' + x + '-' + y).className = 'cell';
            document.getElementById('cell-' + x + '-' + y).innerHTML = '';

            this.game.field[x][y] += 100;
            console.log("🚀 ~ file: script.js ~ line 277 ~ this.game.field[x][y]", this.game.field[x][y])

            
        } else if ((document.getElementById('cell-' + x + '-' + y).innerHTML != '🚩') || (document.getElementById('cell-' + x + '-' + y).innerHTML == '🚩')) {
            if (document.getElementById('cell-' + x + '-' + y).innerHTML != '🚩') {
                document.getElementById('cell-' + x + '-' + y).className = 'cell marked';
                document.getElementById('cell-' + x + '-' + y).innerHTML = '🚩';

                document.getElementById('nbMinesTotal').innerHTML--

                this.game.field[x][y] -= 100;
            } else if (document.getElementById('cell-' + x + '-' + y).innerHTML == '🚩') {
                document.getElementById('cell-' + x + '-' + y).innerHTML = '❓';

                document.getElementById('nbMinesTotal').innerHTML++
            }
        }

        if (document.getElementById('nbMinesTotal').innerHTML == 0) {
            document.getElementById('nbMinesTotal').style.color = '#00d600';
        } else {
            document.getElementById('nbMinesTotal').style.color = '#ff3333';
        }
    },
    checkWin: function() {
        for (let i = 1; i <= this.settings['lines']; i++) {
            for(let j = 1; j <= this.settings['columns']; j++) {
                const v = this.game.field[i][j];
                if (v != -1 && v != -2 && v != -101) {
                    return;
                }
            }
        }

        this.displayWin();
    },
    displayWin: function() {
        document.getElementById('result').innerHTML = 'Gagné';
        document.getElementById('result').style.color = '#43b456';
        document.getElementById('result').style.display = 'flex';

        this.game.status = 0;
    },
    displayLose: function() {
        document.getElementById('result').innerHTML = 'Perdu';
        document.getElementById('result').style.color = '#cc3333';
        document.getElementById('result').style.display = 'flex';

        for(let i = 1; i <= this.settings['lines']; i++) {
            for(let j = 1; j <= this.settings['columns']; j++) {
                if (this.game.field[i][j] == -1 || this.game.field[i][j] == -101) {
                    document.getElementById('cell-' + i + '-' + j).className = 'cell bomb';
                    document.getElementById('cell-' + i + '-' + j).innerHTML = '💣'; 
                }
            }
        }

        this.game.status = 0;
        tester = 1
    },
} 
