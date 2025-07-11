document.addEventListener('DOMContentLoaded', function() {
    // Game Elements
    const gameCards = document.querySelectorAll('.game-card');
    const solarBuilderModal = document.getElementById('solarBuilderModal');
    const atomExplorerModal = document.getElementById('atomExplorerModal');
    const dnaPuzzleModal = document.getElementById('dnaPuzzleModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    
    // Flip card animation
    gameCards.forEach(card => {
        const front = card.querySelector('.game-card-front');
        const back = card.querySelector('.game-card-back');
        const playBtn = front.querySelector('.play-btn');
        const flipBackBtn = back.querySelector('.flip-back-btn');

        // Flip card when clicking anywhere except the play button
        front.addEventListener('click', (e) => {
            if (!e.target.classList.contains('play-btn')) {
                card.classList.add('flipped');
            }
        });

        flipBackBtn.addEventListener('click', () => {
            card.classList.remove('flipped');
        });

        // Start game when play button is clicked
        playBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent the card flip from happening
            const gameId = card.getAttribute('data-game');
            openGameModal(gameId);
        });
    });

    // Close modals when clicking X button
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Close modals when clicking outside the modal content
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('game-modal')) {
            closeAllModals();
        }
    });

    // Open specific game modal
    function openGameModal(gameId) {
        closeAllModals();
        
        switch(gameId) {
            case 'solar-builder':
                initSolarSystemBuilder();
                solarBuilderModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                break;
            case 'atom-explorer':
                initAtomExplorer();
                atomExplorerModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                break;
            case 'dna-puzzle':
                initDNAPuzzle();
                dnaPuzzleModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                break;
        }
    }

    function closeAllModals() {
        solarBuilderModal.style.display = 'none';
        atomExplorerModal.style.display = 'none';
        dnaPuzzleModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    /* ==================== */
    /* SOLAR SYSTEM BUILDER */
    /* ==================== */
    function initSolarSystemBuilder() {
        const planetContainer = document.getElementById('planetContainer');
        const planetOptions = document.querySelectorAll('.planet-option');
        const planetDistance = document.getElementById('planetDistance');
        const planetMass = document.getElementById('planetMass');
        const distanceValue = document.getElementById('distanceValue');
        const massValue = document.getElementById('massValue');
        const addPlanetBtn = document.querySelector('.add-planet-btn');
        const resetBtn = document.querySelector('#solarBuilderModal .reset-btn');
        const simulateBtn = document.querySelector('#solarBuilderModal .simulate-btn');
        
        // Initialize planet selection
        planetOptions[0].classList.add('selected');
        let selectedPlanetType = 'rocky';
        let planets = [];
        let isSimulating = false;
        let animationId = null;

        // Update displayed values
        planetDistance.addEventListener('input', updateDistanceValue);
        planetMass.addEventListener('input', updateMassValue);

        // Set initial values
        updateDistanceValue();
        updateMassValue();

        function updateDistanceValue() {
            distanceValue.textContent = (planetDistance.value / 100).toFixed(1) + ' AU';
        }

        function updateMassValue() {
            massValue.textContent = planetMass.value + ' Earths';
        }

        // Select planet type
        planetOptions.forEach(option => {
            option.addEventListener('click', function() {
                planetOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                selectedPlanetType = this.getAttribute('data-type');
            });
        });

        // Add planet to system
        addPlanetBtn.addEventListener('click', addPlanet);

        function addPlanet() {
            if (isSimulating) return;
            
            const distance = parseInt(planetDistance.value);
            const mass = parseInt(planetMass.value);
            const size = mass / 5; // Scale size based on mass
            
            const planet = document.createElement('div');
            planet.className = `planet ${selectedPlanetType}`;
            planet.style.width = `${20 + size * 5}px`;
            planet.style.height = `${20 + size * 5}px`;
            planet.style.left = `calc(50% + ${distance}px)`;
            planet.style.top = '50%';
            planet.setAttribute('data-mass', mass);
            planet.setAttribute('data-distance', distance);
            
            planetContainer.appendChild(planet);
            planets.push({
                element: planet,
                mass: mass,
                distance: distance,
                angle: Math.random() * Math.PI * 2,
                velocity: 0.01 + Math.random() * 0.02
            });
            
            // Create orbit path
            const orbit = document.createElement('div');
            orbit.className = 'orbit';
            orbit.style.width = `${distance * 2}px`;
            orbit.style.height = `${distance * 2}px`;
            planetContainer.appendChild(orbit);
        }

        // Reset solar system
        resetBtn.addEventListener('click', resetSystem);

        function resetSystem() {
            if (isSimulating) {
                cancelAnimationFrame(animationId);
                isSimulating = false;
                simulateBtn.textContent = 'Start Simulation';
            }
            
            planetContainer.innerHTML = '';
            planets = [];
        }

        // Simulate orbits
        simulateBtn.addEventListener('click', toggleSimulation);

        function toggleSimulation() {
            if (planets.length === 0) {
                alert('Add at least one planet to simulate!');
                return;
            }
            
            isSimulating = !isSimulating;
            
            if (isSimulating) {
                simulateBtn.textContent = 'Stop Simulation';
                simulateOrbits();
            } else {
                cancelAnimationFrame(animationId);
                simulateBtn.textContent = 'Start Simulation';
            }
        }

        function simulateOrbits() {
            planets.forEach(planet => {
                planet.angle += planet.velocity * (50 / planet.distance);
                
                // Calculate position based on angle and distance
                const x = Math.cos(planet.angle) * planet.distance;
                const y = Math.sin(planet.angle) * planet.distance * 0.7; // Flatten the ellipse
                
                planet.element.style.left = `calc(50% + ${x}px)`;
                planet.element.style.top = `calc(50% + ${y}px)`;
            });
            
            animationId = requestAnimationFrame(simulateOrbits);
        }
    }

    /* =============== */
    /* ATOM EXPLORER */
    /* =============== */
    function initAtomExplorer() {
        const nucleus = document.getElementById('nucleus');
        const electronShells = document.getElementById('electronShells');
        const elementInfo = document.querySelector('.element-info');
        const elementSelector = document.getElementById('elementSelector');
        const particleBtns = document.querySelectorAll('.particle-btn');
        const resetBtn = document.querySelector('#atomExplorerModal .reset-btn');
        const bondBtn = document.querySelector('#atomExplorerModal .bond-btn');
        
        let protons = 0;
        let neutrons = 0;
        let electrons = 0;
        let showBonds = false;
        
        // Element data
        const elements = {
            1: { name: 'Hydrogen', symbol: 'H', mass: 1.008, type: 'Non-metal' },
            2: { name: 'Helium', symbol: 'He', mass: 4.0026, type: 'Noble gas' },
            6: { name: 'Carbon', symbol: 'C', mass: 12.011, type: 'Non-metal' },
            7: { name: 'Nitrogen', symbol: 'N', mass: 14.007, type: 'Non-metal' },
            8: { name: 'Oxygen', symbol: 'O', mass: 15.999, type: 'Non-metal' },
            11: { name: 'Sodium', symbol: 'Na', mass: 22.990, type: 'Metal' },
            13: { name: 'Aluminum', symbol: 'Al', mass: 26.982, type: 'Metal' },
            17: { name: 'Chlorine', symbol: 'Cl', mass: 35.453, type: 'Non-metal' },
            20: { name: 'Calcium', symbol: 'Ca', mass: 40.078, type: 'Metal' },
            26: { name: 'Iron', symbol: 'Fe', mass: 55.845, type: 'Metal' },
            29: { name: 'Copper', symbol: 'Cu', mass: 63.546, type: 'Metal' },
            47: { name: 'Silver', symbol: 'Ag', mass: 107.87, type: 'Metal' },
            79: { name: 'Gold', symbol: 'Au', mass: 196.97, type: 'Metal' }
        };
        
        // Initialize with Hydrogen atom
        protons = 1;
        neutrons = 0;
        electrons = 1;
        updateAtom();
        
        // Add particles
        particleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const particleType = this.getAttribute('data-particle');
                addParticle(particleType);
                updateAtom();
            });
        });
        
        // Select element
        elementSelector.addEventListener('change', function() {
            const atomicNumber = parseInt(this.value);
            protons = atomicNumber;
            neutrons = Math.round(elements[atomicNumber].mass) - atomicNumber;
            electrons = atomicNumber;
            updateAtom();
        });
        
        // Reset atom
        resetBtn.addEventListener('click', function() {
            protons = 0;
            neutrons = 0;
            electrons = 0;
            updateAtom();
        });
        
        // Toggle bonds
        bondBtn.addEventListener('click', function() {
            showBonds = !showBonds;
            updateAtom();
            this.textContent = showBonds ? 'Hide Bonds' : 'Show Bonds';
        });
        
        function addParticle(type) {
            switch(type) {
                case 'proton':
                    protons++;
                    if (electrons < protons) electrons = protons;
                    break;
                case 'neutron':
                    neutrons++;
                    break;
                case 'electron':
                    if (electrons < protons + 8) { // Limit electrons to prevent overcrowding
                        electrons++;
                    }
                    break;
            }
        }
        
        function updateAtom() {
            // Clear previous particles
            nucleus.innerHTML = '';
            electronShells.innerHTML = '';
            
            // Update nucleus
            nucleus.textContent = protons;
            
            // Add protons and neutrons to nucleus
            for (let i = 0; i < protons; i++) {
                addParticleToNucleus('proton');
            }
            
            for (let i = 0; i < neutrons; i++) {
                addParticleToNucleus('neutron');
            }
            
            // Add electron shells
            const shellConfig = calculateElectronShells(electrons);
            createElectronShells(shellConfig);
            
            // Update element info
            updateElementInfo();
        }
        
        function addParticleToNucleus(type) {
            const particle = document.createElement('div');
            particle.className = `particle ${type}`;
            particle.textContent = type === 'proton' ? 'p+' : 'n0';
            
            // Random position within nucleus
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 20;
            const x = 30 + Math.cos(angle) * distance;
            const y = 30 + Math.sin(angle) * distance;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            nucleus.appendChild(particle);
        }
        
        function calculateElectronShells(electronCount) {
            const shells = [2, 8, 8, 18, 18, 32, 32]; // Max electrons per shell
            const config = [];
            let remaining = electronCount;
            
            for (let i = 0; i < shells.length && remaining > 0; i++) {
                const max = shells[i];
                const inShell = Math.min(max, remaining);
                config.push(inShell);
                remaining -= inShell;
            }
            
            return config;
        }
        
        function createElectronShells(shellConfig) {
            shellConfig.forEach((count, shellIndex) => {
                const radius = 50 + shellIndex * 50;
                const shell = document.createElement('div');
                shell.className = 'electron-shell';
                shell.style.width = `${radius * 2}px`;
                shell.style.height = `${radius * 2}px`;
                electronShells.appendChild(shell);
                
                // Add electrons to shell
                for (let i = 0; i < count; i++) {
                    const angle = (i / count) * Math.PI * 2;
                    const electron = document.createElement('div');
                    electron.className = 'electron';
                    
                    if (showBonds) {
                        electron.textContent = 'e-';
                        electron.style.display = 'flex';
                        electron.style.alignItems = 'center';
                        electron.style.justifyContent = 'center';
                        electron.style.fontSize = '8px';
                    }
                    
                    electronShells.appendChild(electron);
                    
                    // Position electron in orbit
                    const x = 150 + Math.cos(angle) * radius;
                    const y = 150 + Math.sin(angle) * radius;
                    electron.style.left = `${x}px`;
                    electron.style.top = `${y}px`;
                    
                    // Animate electrons
                    if (showBonds) {
                        animateElectron(electron, angle, radius, shellIndex);
                    }
                }
            });
        }
        
        function animateElectron(electron, startAngle, radius, shellIndex) {
            let angle = startAngle;
            const speed = 0.005 * (1 + shellIndex * 0.3);
            
            function move() {
                angle += speed;
                const x = 150 + Math.cos(angle) * radius;
                const y = 150 + Math.sin(angle) * radius;
                electron.style.left = `${x}px`;
                electron.style.top = `${y}px`;
                
                if (showBonds) {
                    requestAnimationFrame(move);
                }
            }
            
            move();
        }
        
        function updateElementInfo() {
            if (protons === 0) {
                elementInfo.innerHTML = '<h3>Add protons to create an element</h3>';
                return;
            }
            
            const element = elements[protons] || { 
                name: 'Unknown', 
                symbol: '?', 
                mass: protons + neutrons, 
                type: 'Unknown' 
            };
            
            document.getElementById('elementName').textContent = `Element: ${element.name}`;
            document.getElementById('elementSymbol').textContent = `Symbol: ${element.symbol}`;
            document.getElementById('atomicNumber').textContent = `Atomic Number: ${protons}`;
            document.getElementById('atomicMass').textContent = `Atomic Mass: ${(protons + neutrons).toFixed(2)}`;
            document.getElementById('elementType').textContent = `Type: ${element.type}`;
            
            // Update selector to match current element
            if (elements[protons]) {
                elementSelector.value = protons;
            } else {
                elementSelector.value = '';
            }
        }
    }

    /* ============ */
    /* DNA PUZZLE */
    /* ============ */
    function initDNAPuzzle() {
        const basePairsContainer = document.getElementById('basePairs');
        const baseOptions = document.querySelectorAll('.base-option');
        const correctPairsEl = document.getElementById('correctPairs');
        const incorrectPairsEl = document.getElementById('incorrectPairs');
        const resetBtn = document.querySelector('#dnaPuzzleModal .reset-btn');
        const replicateBtn = document.querySelector('#dnaPuzzleModal .replicate-btn');
        
        let correctPairs = 0;
        let incorrectPairs = 0;
        let currentBase = 'A';
        let dnaStrand = [];
        let isReplicating = false;
        
        // Initialize game
        createDNAStrand();
        
        // Select base
        baseOptions[0].classList.add('selected');
        baseOptions.forEach(option => {
            option.addEventListener('click', function() {
                currentBase = this.getAttribute('data-base');
                baseOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
        
        // Reset game
        resetBtn.addEventListener('click', function() {
            correctPairs = 0;
            incorrectPairs = 0;
            correctPairsEl.textContent = '0';
            incorrectPairsEl.textContent = '0';
            createDNAStrand();
        });
        
        // Replicate DNA
        replicateBtn.addEventListener('click', function() {
            if (isReplicating) return;
            
            if (correctPairs < dnaStrand.length / 2) {
                alert('Complete more base pairs before replicating!');
                return;
            }
            
            isReplicating = true;
            replicateDNA();
        });
        
        function createDNAStrand() {
            basePairsContainer.innerHTML = '';
            dnaStrand = [];
            
            // Create random DNA strand (6-10 base pairs)
            const length = 6 + Math.floor(Math.random() * 5);
            const bases = ['A', 'T', 'C', 'G'];
            
            for (let i = 0; i < length; i++) {
                const randomBase = bases[Math.floor(Math.random() * 4)];
                dnaStrand.push(randomBase);
                
                // Create base pair
                createBasePair(randomBase, i, length);
            }
        }
        
        function createBasePair(base, index, total) {
            const pair = document.createElement('div');
            pair.className = 'base-pair';
            
            // Position along DNA strand
            const leftPos = 40 + (index / total) * 20;
            pair.style.left = `${leftPos}%`;
            pair.style.top = `${10 + index * 8}px`;
            
            // Create top base (from original strand)
            const topBase = document.createElement('div');
            topBase.className = `base ${getBaseClass(base)}`;
            topBase.textContent = base;
            topBase.setAttribute('data-base', base);
            
            // Create connector
            const connector = document.createElement('div');
            connector.className = 'base-connector';
            
            // Create bottom base (empty for player to fill)
            const bottomBase = document.createElement('div');
            bottomBase.className = 'base empty';
            bottomBase.addEventListener('click', function() {
                if (this.classList.contains('empty')) {
                    checkBasePair(this, base);
                }
            });
            
            pair.appendChild(topBase);
            pair.appendChild(connector);
            pair.appendChild(bottomBase);
            basePairsContainer.appendChild(pair);
        }
        
        function getBaseClass(base) {
            switch(base) {
                case 'A': return 'adenine';
                case 'T': return 'thymine';
                case 'C': return 'cytosine';
                case 'G': return 'guanine';
            }
        }
        
        function checkBasePair(element, correctBase) {
            let isCorrect = false;
            let pairedBase = '';
            
            switch(correctBase) {
                case 'A': 
                    isCorrect = currentBase === 'T';
                    pairedBase = 'T';
                    break;
                case 'T':
                    isCorrect = currentBase === 'A';
                    pairedBase = 'A';
                    break;
                case 'C':
                    isCorrect = currentBase === 'G';
                    pairedBase = 'G';
                    break;
                case 'G':
                    isCorrect = currentBase === 'C';
                    pairedBase = 'C';
                    break;
            }
            
            if (isCorrect) {
                element.className = `base ${getBaseClass(currentBase)}`;
                element.textContent = currentBase;
                correctPairs++;
                correctPairsEl.textContent = correctPairs;
                
                // Visual feedback
                element.style.transform = 'scale(1.1)';
                setTimeout(() => element.style.transform = 'scale(1)', 300);
            } else {
                incorrectPairs++;
                incorrectPairsEl.textContent = incorrectPairs;
                
                // Visual feedback
                element.style.backgroundColor = '#ffcdd2';
                element.style.transform = 'translateX(-5px)';
                setTimeout(() => {
                    element.style.backgroundColor = '';
                    element.style.transform = '';
                }, 300);
                
                // Show correct answer after delay
                setTimeout(() => {
                    if (element.classList.contains('empty')) {
                        element.className = `base ${getBaseClass(pairedBase)}`;
                        element.textContent = pairedBase;
                    }
                }, 1000);
            }
        }
        
        function replicateDNA() {
            const allPairs = document.querySelectorAll('.base-pair');
            let delay = 0;
            
            allPairs.forEach(pair => {
                const bases = pair.querySelectorAll('.base');
                const originalBase = bases[0];
                const newStrandBase = bases[1];
                
                // Only replicate if the pair is correct
                if (!newStrandBase.classList.contains('empty')) {
                    setTimeout(() => {
                        // Create new pair elements
                        const newPair = document.createElement('div');
                        newPair.className = 'base-pair replicated';
                        
                        // Position new pair below original
                        const pos = pair.style.left;
                        newPair.style.left = pos;
                        newPair.style.top = `${parseInt(pair.style.top) + 100}px`;
                        
                        // Create bases (complementary to the new strand)
                        const topBase = document.createElement('div');
                        const bottomBase = document.createElement('div');
                        
                        // Determine which base is which
                        if (newStrandBase.textContent === originalBase.textContent) {
                            // Original strand
                            topBase.className = originalBase.className;
                            topBase.textContent = originalBase.textContent;
                            
                            // Complementary base
                            bottomBase.className = `base ${getBaseClass(newStrandBase.textContent)}`;
                            bottomBase.textContent = newStrandBase.textContent;
                        } else {
                            // New strand (complementary to original)
                            topBase.className = newStrandBase.className;
                            topBase.textContent = newStrandBase.textContent;
                            
                            // Complementary base (same as original)
                            bottomBase.className = originalBase.className;
                            bottomBase.textContent = originalBase.textContent;
                        }
                        
                        // Create connector
                        const connector = document.createElement('div');
                        connector.className = 'base-connector';
                        
                        newPair.appendChild(topBase);
                        newPair.appendChild(connector);
                        newPair.appendChild(bottomBase);
                        basePairsContainer.appendChild(newPair);
                        
                        // Animation
                        newPair.style.opacity = '0';
                        newPair.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            newPair.style.opacity = '1';
                            newPair.style.transform = 'translateY(0)';
                        }, 50);
                    }, delay);
                    
                    delay += 200;
                }
            });
            
            setTimeout(() => {
                isReplicating = false;
            }, delay + 500);
        }
    }
});
