let currentCompany = localStorage.getItem('fh_current_company') || 'boulangerie';

let gameState = {
    companyType: currentCompany,
    step: 1,
    xp: 100,
    journal: [],
    balances: {
        "101": { debit: 0, credit: 0, label: "101 - Capital Social" },
        "164": { debit: 0, credit: 0, label: "164 - Emprunts" },
        "203": { debit: 0, credit: 0, label: "203 - Frais de Recherche & Dév." },
        "215": { debit: 0, credit: 0, label: "215 - Matériel Industriel" },
        "2815": { debit: 0, credit: 0, label: "2815 - Amortissement Matériel" },
        "311": { debit: 0, credit: 0, label: "311 - Stocks Matières Premières" },
        "355": { debit: 0, credit: 0, label: "355 - Stocks de Produits Finis" },
        "401": { debit: 0, credit: 0, label: "401 - Fournisseurs" },
        "411": { debit: 0, credit: 0, label: "411 - Clients" },
        "416": { debit: 0, credit: 0, label: "416 - Clients Douteux" },
        "431": { debit: 0, credit: 0, label: "431 - Sécurité Sociale (URSSAF)" },
        "44566": { debit: 0, credit: 0, label: "44566 - TVA Déductible" },
        "44571": { debit: 0, credit: 0, label: "44571 - TVA Collectée" },
        "44551": { debit: 0, credit: 0, label: "44551 - TVA à payer" },
        "487": { debit: 0, credit: 0, label: "487 - Produits Constatés d'Avance" },
        "512": { debit: 0, credit: 0, label: "512 - Banque" },
        "601": { debit: 0, credit: 0, label: "601 - Achats Matières Premières" },
        "6031": { debit: 0, credit: 0, label: "6031 - Variation des Stocks de Mat." },
        "641": { debit: 0, credit: 0, label: "641 - Salaires du personnel" },
        "645": { debit: 0, credit: 0, label: "645 - Charges de Sécurité Sociale" },
        "656": { debit: 0, credit: 0, label: "656 - Pertes sur Créances Irrécouvrables" },
        "666": { debit: 0, credit: 0, label: "666 - Pertes de Change" },
        "675": { debit: 0, credit: 0, label: "675 - Valeur Comptable des Éléments Cédés" },
        "6811": { debit: 0, credit: 0, label: "6811 - Dotation Amortissements" },
        "695": { debit: 0, credit: 0, label: "695 - Impôts sur les bénéfices" },
        "701": { debit: 0, credit: 0, label: "701 - Ventes de Produits Finis / Prestations" },
        "713": { debit: 0, credit: 0, label: "713 - Variation Stocks Produits Finis" },
        "721": { debit: 0, credit: 0, label: "721 - Production Immobilisée" },
        "775": { debit: 0, credit: 0, label: "775 - Produits des Cessions d'Éléments d'Actif" }
    }
};

function initGame() {
    const localSave = localStorage.getItem('financial_hero_save');
    if (localSave) {
        try {
            const parsed = JSON.parse(atob(localSave));
            if (parsed && parsed.companyType) {
                gameState = parsed;
                currentCompany = parsed.companyType;
            }
        } catch(e) { 
            console.error("Erreur de restauration, nettoyage de la sauvegarde.");
            localStorage.removeItem('financial_hero_save');
        }
    }
    renderUI();
}

function renderUI() {
    // Sécurité si les scénarios ne sont pas encore chargés par le navigateur
    if (typeof scenarios === 'undefined') {
        console.warn("Base de données des scénarios introuvable.");
        return;
    }

    const pool = scenarios[currentCompany];
    const scenario = pool ? pool[gameState.step] : null;

    if (!scenario) {
        document.getElementById('mission-title').innerText = "Parcours Terminé !";
        document.getElementById('quest-title').innerText = "🏆 Expert Diplômé !";
        document.getElementById('quest-description').innerHTML = `<p>Tu as validé les 15 étapes de cette nature d'entreprise. Ton expertise comptable sur cette filière est totale.</p>
        <button onclick="resetGameTesting()" class="btn-main" style="cursor: pointer; background-color: var(--accent-green); color: white; padding: 10px 20px; border: none; border-radius: 6px; font-weight: bold;">Retourner au menu principal</button>`;
        document.getElementById('xp-bar').style.width = "100%";
        renderFinancials();
        return;
    }

    document.getElementById('mission-title').innerText = `[${currentCompany.toUpperCase()}] ${scenario.title}`;
    document.getElementById('quest-title').innerText = scenario.title;
    document.getElementById('quest-description').innerHTML = scenario.description;
    document.getElementById('xp-display').innerText = gameState.xp;
    document.getElementById('xp-bar').style.width = (gameState.step * 6.6) + "%";

    const select = document.getElementById('account-select');
    if (select) {
        select.innerHTML = '';
        for (let code in scenario.accounts) {
            select.innerHTML += `<option value="${code}">${scenario.accounts[code]}</option>`;
        }
    }

    const tbody = document.getElementById('journal-table-body');
    if (tbody) {
        tbody.innerHTML = '';
        gameState.journal.forEach((item, index) => {
            tbody.innerHTML += `<tr>
                <td><strong>${item.account}</strong></td>
                <td>${item.debit || '-'}</td>
                <td>${item.credit || '-'}</td>
                <td><button onclick="deleteLine(${index})" class="btn-danger">❌ Effacer</button></td>
            </tr>`;
        });
    }

    renderFinancials();
}

function handleFormSubmit() {
    if (typeof scenarios === 'undefined') return;
    const pool = scenarios[currentCompany];
    const scenario = pool ? pool[gameState.step] : null;
    if (!scenario) return;

    const account = document.getElementById('account-select').value;
    const debit = parseFloat(document.getElementById('input-debit').value) || 0;
    const credit = parseFloat(document.getElementById('input-credit').value) || 0;
    const errorBox = document.getElementById('error-message');

    if (debit === 0 && credit === 0 && ! [14, 15].includes(gameState.step)) {
        return alert("Indique un montant.");
    }
    if (debit > 0 && credit > 0) return alert("Double saisie interdite.");

    const expected = scenario.expectedEntries[account];
    if (!expected) {
        showError(`⚠️ Erreur : Le compte ${account} n'est pas utilisé dans cette étape.`);
        return;
    }

    if ((expected.debit && debit !== expected.debit) || (expected.credit && credit !== expected.credit) || (expected.debit && credit > 0) || (expected.credit && debit > 0)) {
        gameState.xp = Math.max(0, gameState.xp - 10);
        showError(`❌ Erreur d'écriture sur le compte ${account}. Vérifie le sens du flux de ton plan comptable.`);
        document.getElementById('xp-display').innerText = gameState.xp;
        return;
    }

    errorBox.style.display = 'none';
    gameState.journal.push({ account, debit, credit });
    gameState.balances[account].debit += debit;
    gameState.balances[account].credit += credit;

    document.getElementById('input-debit').value = 0;
    document.getElementById('input-credit').value = 0;

    autoSave();
    renderUI();
}

function showError(msg) {
    const errorBox = document.getElementById('error-message');
    if (errorBox) {
        errorBox.style.display = 'block';
        errorBox.innerText = msg;
    }
}

function renderFinancials() {
    const actifList = document.getElementById('actif-list');
    const passifList = document.getElementById('passif-list');
    const chargesList = document.getElementById('charges-list');
    const produitsList = document.getElementById('produits-list');
    
    if (!actifList || !passifList || !chargesList || !produitsList) return;
    
    actifList.innerHTML = ''; passifList.innerHTML = ''; chargesList.innerHTML = ''; produitsList.innerHTML = '';
    
    let totalActif = 0; let totalPassif = 0; let totalCharges = 0; let totalProduits = 0;

    for (let acc in gameState.balances) {
        const d = gameState.balances[acc].debit;
        const c = gameState.balances[acc].credit;
        const labelComplexe = gameState.balances[acc].label;

        if (acc.startsWith('6')) {
            const solde = d - c;
            if (solde !== 0) {
                chargesList.innerHTML += `<div class="financial-line"><span>${labelComplexe}</span><strong>${solde} €</strong></div>`;
                totalCharges += solde;
            }
        } else if (acc.startsWith('7')) {
            const solde = c - d;
            if (solde !== 0) {
                produitsList.innerHTML += `<div class="financial-line"><span>${labelComplexe}</span><strong>${solde} €</strong></div>`;
                totalProduits += solde;
            }
        } 
        else {
            if (["203", "215", "311", "355", "411", "416", "44566", "512"].includes(acc)) {
                const soldeActif = d - c;
                if (soldeActif !== 0) {
                    actifList.innerHTML += `<div class="financial-line"><span>${labelComplexe}</span><strong>${soldeActif} €</strong></div>`;
                    totalActif += soldeActif;
                }
            } 
            else {
                const soldePassif = c - d;
                if (soldePassif !== 0) {
                    passifList.innerHTML += `<div class="financial-line"><span>${labelComplexe}</span><strong>${soldePassif} €</strong></div>`;
                    totalPassif += soldePassif;
                }
            }
        }
    }

    const resultatCourant = totalProduits - totalCharges;
    if (resultatCourant > 0) {
        passifList.innerHTML += `<div class="financial-line" style="color:var(--accent-green)"><span>120 - Bénéfice de l'exercice</span><strong>${resultatCourant} €</strong></div>`;
        totalPassif += resultatCourant;
    } else if (resultatCourant < 0) {
        passifList.innerHTML += `<div class="financial-line" style="color:var(--accent-red)"><span>129 - Perte de l'exercice</span><strong>${resultatCourant} €</strong></div>`;
        totalPassif += resultatCourant;
    }

    document.getElementById('total-actif').innerText = totalActif;
    document.getElementById('total-passif').innerText = totalPassif;
    document.getElementById('total-charges').innerText = totalCharges;
    document.getElementById('total-produits').innerText = totalProduits;
    document.getElementById('resultat-net').innerText = resultatCourant;

    if (typeof scenarios === 'undefined') return;
    const pool = scenarios[currentCompany];
    const scenario = pool ? pool[gameState.step] : null;
    if (!scenario) return;
    
    const linesRequired = Object.keys(scenario.expectedEntries).length;
    if (gameState.journal.length === linesRequired && totalActif === totalPassif) {
        document.getElementById('success-panel').style.display = 'block';
        autoSave();
    } else {
        document.getElementById('success-panel').style.display = 'none';
    }
}

function deleteLine(index) {
    const item = gameState.journal[index];
    gameState.balances[item.account].debit -= item.debit;
    gameState.balances[item.account].credit -= item.credit;
    gameState.journal.splice(index, 1);
    autoSave();
    renderUI();
}

function autoSave() {
    const encryptedSave = btoa(JSON.stringify(gameState));
    localStorage.setItem('financial_hero_save', encryptedSave);
}

function manualSaveAndExit() {
    autoSave();
    window.location.href = 'index.html';
}

function skipStepTesting() {
    if (typeof scenarios === 'undefined') return;
    const pool = scenarios[currentCompany];
    const scenario = pool ? pool[gameState.step] : null;
    if (!scenario) return;
    gameState.journal = [];
    for (let acc in scenario.expectedEntries) {
        const expected = scenario.expectedEntries[acc];
        const deb = expected.debit || 0;
        const cred = expected.credit || 0;
        gameState.journal.push({ account: acc, debit: deb, credit: cred });
        gameState.balances[acc].debit += deb;
        gameState.balances[acc].credit += cred;
    }
    autoSave(); renderUI();
}

function previousStepTesting() {
    if (gameState.step > 1) {
        gameState.step -= 1; gameState.journal = []; autoSave(); renderUI();
    }
}

// CORRECTION CRUCIALE : Cette fonction nettoie la mémoire quoiqu'il arrive
function resetGameTesting() {
    localStorage.removeItem('financial_hero_save');
    localStorage.removeItem('fh_current_company');
    window.location.href = 'index.html';
}

function goToNextStep() {
    gameState.step += 1;
    gameState.journal = [];
    autoSave();
    renderUI();
}

window.onload = initGame;
