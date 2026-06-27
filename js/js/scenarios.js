const scenarios = {
    boulangerie: {
        1: {
            title: "Mois 1 : Financement & Apport",
            description: "Dépôt du capital social de 20 000 € et déblocage de l'emprunt bancaire de 30 000 €.",
            accounts: { "512": "512 - Banque", "101": "101 - Capital Social", "164": "164 - Emprunts" },
            expectedEntries: { "512": { debit: 50000 }, "101": { credit: 20000 }, "164": { credit: 30000 } }
        },
        2: {
            title: "Mois 2 : Acquisition du Four de boulangerie",
            description: "Achat d'un four professionnel d'une valeur de 15 000 € HT payé au comptant.",
            accounts: { "215": "215 - Matériel Industriel", "512": "512 - Banque" },
            expectedEntries: { "215": { debit: 15000 }, "512": { credit: 15000 } }
        },
        3: {
            title: "Mois 3 à 10 : Ventes récurrentes de pains",
            description: "Enregistrement globale de l'activité commerciale : Ventes de pains pour 40 000 € HT (TVA 5,5% soit 2 200 € Collectée) réglées par les clients par carte/espèces.",
            accounts: { "512": "512 - Banque", "701": "701 - Ventes de pain", "44571": "44571 - TVA Collectée" },
            expectedEntries: { "512": { debit: 42200 }, "701": { credit: 40000 }, "44571": { credit: 2200 } }
        },
        4: {
            title: "Mois 11 : Achat de matières premières",
            description: "Achat de farine et ingrédients pour 10 000 € HT (TVA 5,5% déductible soit 550 €) facturés par le fournisseur de blé.",
            accounts: { "601": "601 - Achats Farine", "44566": "44566 - TVA Déductible", "401": "401 - Fournisseurs" },
            expectedEntries: { "601": { debit: 10000 }, "44566": { debit: 550 }, "401": { credit: 10550 } }
        },
        5: {
            title: "Mois 11 : Règlement du meunier",
            description: "Paiement par virement de la totalité de la facture du fournisseur de farine pour 10 555 €.",
            accounts: { "401": "401 - Fournisseurs", "512": "512 - Banque" },
            expectedEntries: { "401": { debit: 10550 }, "512": { credit: 10550 } }
        },
        6: {
            title: "Mois 12 : La fiche de paie de l'apprenti",
            description: "Enregistrement du salaire brut de l'apprenti boulanger pour 2 000 € (Débit 641) avec constatation de la dette nette de 1 600 € due au salarié (Crédit 411 agissant ici en tiers salaires par simplification).",
            accounts: { "641": "641 - Salaires du personnel", "411": "411 - Personnel Salarié" },
            expectedEntries: { "641": { debit: 2000 }, "411": { credit: 1600 } }
        },
        7: {
            title: "Mois 12 : Les Charges Sociales Patronales",
            description: "Enregistrement de la part patronale due aux organismes sociaux (URSSAF) s'élevant à 400 €.",
            accounts: { "645": "645 - Charges Sociales", "431": "431 - URSSAF" },
            expectedEntries: { "645": { debit: 400 }, "431": { credit: 400 } }
        },
        8: {
            title: "Mois 12 : Versement des salaires",
            description: "Virement bancaire pour solder la rémunération nette due à l'apprenti d'un montant de 1 600 €.",
            accounts: { "411": "411 - Personnel Salarié", "512": "512 - Banque" },
            expectedEntries: { "411": { debit: 1600 }, "512": { credit: 1600 } }
        },
        9: {
            title: "Inventaire : Cession d'actif (Vente d'un vieux pétrin)",
            description: "Pierre décide de revendre un ancien petit pétrin d'occasion pour 1 000 € facturé à un confrère (sans TVA applicable ici).",
            accounts: { "411": "411 - Clients", "775": "775 - Produits des cessions d'actifs" },
            expectedEntries: { "411": { debit: 1000 }, "775": { credit: 1000 } }
        },
        10: {
            title: "Inventaire : Sortie du patrimoine de l'actif cédé",
            description: "L'ancien pétrin, acheté à l'origine 1 000 €, doit être retiré des comptes de l'actif.",
            accounts: { "675": "675 - VNC des actifs cédés", "215": "215 - Matériel Industriel" },
            expectedEntries: { "675": { debit: 1000 }, "215": { credit: 1000 } }
        },
        11: {
            title: "Inventaire : Clôture de la déclaration de TVA",
            description: "Soldez les comptes de TVA mensuels : TVA Collectée (2 200 €) et TVA Déductible (550 €). Constatez la TVA nette à payer à l'État.",
            accounts: { "44571": "44571 - TVA Collectée", "44566": "44566 - TVA Déductible", "44551": "44551 - TVA à payer" },
            expectedEntries: { "44571": { debit: 2200 }, "44566": { credit: 550 }, "44551": { credit: 1650 } }
        },
        12: {
            title: "Inventaire : Amortissement linéaire du four principal",
            description: "Le four de 15 000 € s'amortit sur 5 ans (soit 20% par an). Enregistrez la dotation d'inventaire annuelle de 3 000 €.",
            accounts: { "6811": "6811 - Dotation Amortissements", "2815": "2815 - Amortissement Matériel" },
            expectedEntries: { "6811": { debit: 3000 }, "2815": { credit: 3000 } }
        },
        13: {
            title: "Inventaire : Valorisation des stocks physiques",
            description: "Après comptage au 31 décembre, il reste un stock physique de farine valorisé à 2 000 € en réserve. Augmentez l'actif de stock (311) en contrepartie du compte de variation (6031).",
            accounts: { "311": "311 - Stocks Farine", "6031": "6031 - Variation Stocks Mat." },
            expectedEntries: { "311": { debit: 2000 }, "6031": { credit: 2000 } }
        },
        14: {
            title: "Fiscalité : Calcul de l'Impôt sur les Sociétés (IS)",
            description: "Calcul du résultat fiscal après prise en compte des stocks et dotations. L'IS dû s'élève à 2 500 €.",
            accounts: { "695": "695 - Impôt sur les bénéfices", "401": "401 - Dettes d'impôt" },
            expectedEntries: { "695": { debit: 2500 }, "401": { credit: 2500 } }
        },
        15: {
            title: "Clôture de l'exercice : Validation finale du bilan",
            description: "Le grand livre analytique est prêt. Passez une ligne technique à 0 € sur le compte 101 pour valider l'année et débloquer votre diplôme.",
            accounts: { "101": "101 - Capital Social" },
            expectedEntries: { "101": { debit: 0 } }
        }
    },
    saas: {
        1: {
            title: "Mois 1 : Levée de fonds (Amorçage)",
            description: "Des business angels investissent 100 000 € en cash déposés directement sur le compte en banque de la startup.",
            accounts: { "512": "512 - Banque", "101": "101 - Capital Social" },
            expectedEntries: { "512": { debit: 100000 }, "101": { credit: 100000 } }
        },
        2: {
            title: "Mois 2 : Activation des frais de Recherche & Développement",
            description: "L'équipe technique a développé l'infrastructure de la plateforme. La loi permet d'activer ces salaires en immobilisations incorporelles pour 25 000 € HT.",
            accounts: { "203": "203 - Frais de R&D", "721": "721 - Production Immobilisée" },
            expectedEntries: { "203": { debit: 25000 }, "721": { credit: 25000 } }
        },
        3: {
            title: "Mois 3 : Encaissement des abonnements annuels",
            description: "Une campagne commerciale rapporte 60 000 € HT de licences logicielles d'un an, encaissées immédiatement par virement (+ 12 000 € de TVA collectée à 20%).",
            accounts: { "512": "512 - Banque", "701": "701 - Ventes Licences", "44571": "44571 - TVA Collectée" },
            expectedEntries: { "512": { debit: 72000 }, "701": { credit: 60000 }, "44571": { credit: 12000 } }
        },
        4: {
            title: "Mois 6 : Facturation d'un serveur Cloud américain",
            description: "Achat d'hébergement chez AWS aux USA pour 5 000 € convertis en Euros (Autoliquidation de la TVA ignorée pour simplification).",
            accounts: { "601": "601 - Serveurs Cloud", "401": "401 - Fournisseurs" },
            expectedEntries: { "601": { debit: 5000 }, "401": { credit: 5000 } }
        },
        5: {
            title: "Mois 8 : Vente à l'international en Dollars ($)",
            description: "Vente de licences à un client basé à New-York pour un équivalent brut de 10 000 € HT enregistré dans l'attente du règlement.",
            accounts: { "411": "411 - Clients", "701": "701 - Ventes Licences" },
            expectedEntries: { "411": { debit: 10000 }, "701": { credit: 10000 } }
        },
        6: {
            title: "Mois 10 : Perte de change sur le virement en Dollars",
            description: "Le client américain paie. Malheureusement, le cours de l'Euro a grimpé : nous ne recevons que 9 600 € sur notre compte en banque. Constatez la perte de change de 400 €.",
            accounts: { "512": "512 - Banque", "666": "666 - Pertes de Change", "411": "411 - Clients" },
            expectedEntries: { "512": { debit: 9600 }, "666": { debit: 400 }, "411": { credit: 10000 } }
        },
        7: {
            title: "Mois 12 : Rémunération des ingénieurs réseau",
            description: "Saisie des salaires bruts du pôle technique pour un total de 12 000 €.",
            accounts: { "641": "641 - Salaires du personnel", "411": "411 - Personnel Salarié" },
            expectedEntries: { "641": { debit: 12000 }, "411": { credit: 9000 } } // 9000 net estimé
        },
        8: {
            title: "Mois 12 : Paiement des cotisations URSSAF",
            description: "Enregistrement des charges et cotisations sociales patronales tech du mois pour 3 000 €.",
            accounts: { "645": "645 - Charges Sociales", "431": "431 - URSSAF" },
            expectedEntries: { "645": { debit: 3000 }, "431": { credit: 3000 } }
        },
        9: {
            title: "Cut-off : Traitement des abonnements à cheval (PCA)",
            description: "Les abonnements vendus au mois 3 (60 000 €) couraient sur un an. Seule la moitié concerne cette année. Écartez 30 000 € du résultat en Produits Constatés d'Avance (487).",
            accounts: { "701": "701 - Ventes Licences", "487": "487 - Produits Constatés d'Avance" },
            expectedEntries: { "701": { debit: 30000 }, "487": { credit: 30000 } }
        },
        10: {
            title: "Inventaire : Client douteux en situation de faillite",
            description: "Un client français nous doit 5 000 € mais fait l'objet d'un redressement judiciaire. Transférez sa créance vers le compte d'alerte 416.",
            accounts: { "416": "416 - Clients Douteux", "411": "411 - Clients" },
            expectedEntries: { "416": { debit: 5000 }, "411": { credit: 5000 } }
        },
        11: {
            title: "Inventaire : Provisionnement de la perte client probable",
            description: "L'avocat estime que nous allons perdre 100% de la somme du client douteux. Passez une charge de dépréciation pour 5 000 € (compte 656 par raccourci).",
            accounts: { "656": "656 - Pertes sur Créance", "416": "416 - Clients Douteux" },
            expectedEntries: { "656": { debit: 5000 }, "416": { credit: 5000 } }
        },
        12: {
            title: "Inventaire : Amortissement des frais de R&D",
            description: "Les frais logiciels activés à l'étape 2 (25 000 €) s'amortissent sur 5 ans. Passez la dotation de 5 000 €.",
            accounts: { "6811": "6811 - Dotation Amortissements", "2815": "2815 - Amortissement Matériel" },
            expectedEntries: { "6811": { debit: 5000 }, "2815": { credit: 5000 } }
        },
        13: {
            title: "Inventaire : Centralisation de l'état de TVA",
            description: "Solder le compte de TVA Collectée unique de 12 000 € pour matérialiser la dette fiscale (44551).",
            accounts: { "44571": "44571 - TVA Collectée", "44551": "44551 - TVA à payer" },
            expectedEntries: { "44571": { debit: 12000 }, "44551": { credit: 12000 } }
        },
        14: {
            title: "Fiscalité : Résultat fiscal déficitaire",
            description: "En raison des investissements de croissance et du cut-off, la startup affiche une perte fiscale. L'IS de fin d'année est égal à 0 €.",
            accounts: { "695": "695 - Impôt sur les bénéfices" },
            expectedEntries: { "695": { debit: 0 } }
        },
        15: {
            title: "Clôture : Validation de l'exercice SaaS",
            description: "Fin du tunnel d'inventaire tech. Saisissez 0 € au débit du compte de capital pour finaliser.",
            accounts: { "101": "101 - Capital Social" },
            expectedEntries: { "101": { debit: 0 } }
        }
    },
    industrie: {
        1: {
            title: "Mois 1 : Prêt industriel d'usine",
            description: "Financement des infrastructures : Emprunt de 500 000 € crédité sur la trésorerie de l'entreprise.",
            accounts: { "512": "512 - Banque", "164": "164 - Emprunts" },
            expectedEntries: { "512": { debit: 500000 }, "164": { credit: 500000 } }
        },
        2: {
            title: "Mois 2 : Installation des lignes de robotique",
            description: "Achat d'équipements de production pour 300 000 € HT réglés par virement bancaire.",
            accounts: { "215": "215 - Matériel Industriel", "512": "512 - Banque" },
            expectedEntries: { "215": { debit: 300000 }, "512": { credit: 300000 } }
        },
        3: {
            title: "Mois 4 : Approvisionnement massif de tôles et aciers",
            description: "Achat de métaux lourds de fabrication pour 80 000 € HT facturés par le grossiste sidérurgique.",
            accounts: { "601": "601 - Achats Matières", "401": "401 - Fournisseurs" },
            expectedEntries: { "601": { debit: 80000 }, "401": { credit: 80000 } }
        },
        4: {
            title: "Mois 6 : Ventes de turbines manufacturées",
            description: "Expédition des premières machines finies aux clients de l'énergie pour un montant de 200 000 € HT configuré à crédit.",
            accounts: { "411": "411 - Clients", "701": "701 - Ventes Produits Finis" },
            expectedEntries: { "411": { debit: 200000 }, "701": { credit: 200000 } }
        },
        5: {
            title: "Mois 8 : Encaissement des créances clients",
            description: "Encaissement effectif des virements des acheteurs industriels pour un total de 150 000 €.",
            accounts: { "512": "512 - Banque", "411": "411 - Clients" },
            expectedEntries: { "512": { debit: 150000 }, "411": { credit: 150000 } }
        },
        6: {
            title: "Mois 10 : Salaires de l'équipe d'usine (Ouvriers)",
            description: "Comptabilisation de la masse salariale brute des équipes de fabrication pour 40 000 €.",
            accounts: { "641": "641 - Salaires du personnel", "411": "411 - Personnel Salarié" },
            expectedEntries: { "641": { debit: 40000 }, "411": { credit: 30000 } }
        },
        7: {
            title: "Mois 10 : Déclaration des charges patronales d'usine",
            description: "Enregistrement des cotisations de retraite et prévoyance d'usine pour 10 000 €.",
            accounts: { "645": "645 - Charges Sociales", "431": "431 - URSSAF" },
            expectedEntries: { "645": { debit: 10000 }, "431": { credit: 10000 } }
        },
        8: {
            title: "Mois 12 : Paiement des cotisations URSSAF",
            description: "Règlement bancaire des charges sociales du trimestre pour 10 000 €.",
            accounts: { "431": "431 - URSSAF", "512": "512 - Banque" },
            expectedEntries: { "431": { debit: 10000 }, "512": { credit: 10000 } }
        },
        9: {
            title: "Inventaire : Stockage résiduel de l'acier (Matières)",
            description: "Après contrôle, la valeur de l'acier resté en stock physique s'élève à 30 000 €. Enregistrez ce stock final d'actif.",
            accounts: { "311": "311 - Stocks Matières", "6031": "6031 - Variation Stocks Mat." },
            expectedEntries: { "311": { debit: 30000 }, "6031": { credit: 30000 } }
        },
        10: {
            title: "Inventaire : Stockage des Produits Finis (Turbines invendues)",
            description: "Des turbines terminées mais non livrées dorment dans les hangars pour une valeur d'usine de 50 000 €. Valorisez l'actif (355) via le compte de production stockée (713).",
            accounts: { "355": "355 - Stocks Prod Finis", "713": "713 - Variation Stocks Prod" },
            expectedEntries: { "355": { debit: 50000 }, "713": { credit: 50000 } }
        },
        11: {
            title: "Inventaire : Amortissement lourd de la chaîne robotique",
            description: "La robotique de 300 000 € est amortie sur 10 ans. Enregistrez la charge annuelle d'inventaire de 30 000 € HT.",
            accounts: { "6811": "6811 - Dotation Amortissements", "2815": "2815 - Amortissement Matériel" },
            expectedEntries: { "6811": { debit: 30000 }, "2815": { credit: 30000 } }
        },
        12: {
            title: "Consolidation : Retraitement des ventes internes de groupe",
            description: "La maison mère a vendu pour 10 000 € de pièces à sa propre filiale logistique. En consolidation de groupe, ces ventes croisées doivent être éliminées pour éviter les doublons. Annulez ce produit (701).",
            accounts: { "701": "701 - Ventes Produits Finis", "411": "411 - Clients" },
            expectedEntries: { "701": { debit: 10000 }, "411": { credit: 10000 } }
        },
        13: {
            title: "Consolidation : Retraitement des achats internes réciproques",
            description: "Symétriquement, éliminez la charge interne correspondante de 10 000 € enregistrée dans les livres.",
            accounts: { "401": "401 - Fournisseurs", "601": "601 - Achats Matières" },
            expectedEntries: { "401": { debit: 10000 }, "601": { credit: 10000 } }
        },
        14: {
            title: "Fiscalité : Liquidation de l'Impôt sur les Sociétés Groupe",
            description: "L'impôt consolidé ajusté de l'industrie s'élève à 15 000 €.",
            accounts: { "695": "695 - Impôt sur les bénéfices", "401": "401 - Dettes d'impôt" },
            expectedEntries: { "695": { debit: 15000 }, "401": { credit: 15000 } }
        },
        15: {
            title: "Clôture : Validation finale du Groupe Industriel",
            description: "Saisissez 0 € au débit du compte de capital pour imprimer les comptes consolidés définitifs de l'année.",
            accounts: { "101": "101 - Capital Social" },
            expectedEntries: { "101": { debit: 0 } }
        }
    }
};
