
    function updateCommentsSection(lang) {
      const textarea = document.getElementById("comments");
      const label = document.getElementById("commentsLabel");
      // Mise à jour du placeholder
      if (generalTranslations.placeholder[lang]) {
        textarea.placeholder = generalTranslations.placeholder[lang];
      }
      // Mise à jour du label
      if (generalTranslations.commentsLabel[lang]) {
        label.textContent = generalTranslations.commentsLabel[lang];
      }
    }
    // Appliquer la langue par défaut (français)
    updateCommentsSection("fr");
    // Écouteur d'événement sur le sélecteur
    document.getElementById("language").addEventListener("change", function() {
      updateCommentsSection(this.value);
    });
    // ===== selection de la langue =================== 
    function selectLanguage() {
      const lang = document.getElementById("language").value;
      if (!lang) return;
      currentLanguage = lang;
      const t = translations[lang];
      // Mise à jour des champs commentaires
      updateCommentsSection(lang);
      // Mise à jour des textes
      document.getElementById("language-selection").classList.add("hidden");
      document.getElementById("user-form").classList.remove("hidden");
      document.getElementById("welcome-message").innerText = t.welcome;
      document.getElementById("label-username").innerText = t.username;
      document.getElementById("label-phone").innerText = t.phone;
      document.getElementById("btn-continue").innerText = t.continue;
      document.getElementById("btn-back").innerText = t.back;
      document.getElementById("property-title").innerText = t.propertyTitle;
      document.getElementById("btn-save").innerText = t.save;
      // Mise à jour des en-têtes du tableau
      const tableHeaders = document.querySelectorAll("#property-table th");
      t.tableHeaders.forEach((header, index) => {
        tableHeaders[index].innerText = header;
      });
      // === Gère la direction RTL pour l'arabe ===
      const form = document.getElementById("user-form");
      const content = document.getElementById("content");
      const table = document.getElementById("property-table");
      if (lang === "ar") {
        form.classList.add("rtl");
        form.style.direction = "rtl";
        form.style.textAlign = "right";
        content.classList.add("rtl");
        content.style.direction = "rtl";
        content.style.textAlign = "right";
        table.classList.add("rtl-table");
        table.setAttribute("dir", "rtl");
      } else {
        form.classList.remove("rtl");
        form.style.direction = "ltr";
        form.style.textAlign = "left";
        content.classList.remove("rtl");
        content.style.direction = "ltr";
        content.style.textAlign = "left";
        table.classList.remove("rtl-table");
        table.removeAttribute("dir");
      }
    }
    // ================================== 
    function submitUserInfo() {
      const t = translations[currentLanguage];
      const username = document.getElementById("username").value.trim();
      const phone = document.getElementById("phone").value.trim();
      if (!username || !phone) {
        alert(t.fillAll);
        return;
      }
      const phoneRegex = /^\+?\d{8,15}$/;
      if (!phoneRegex.test(phone)) {
        alert(t.invalidPhone);
        return;
      }
      document.getElementById("user-form").classList.add("hidden");
      document.getElementById("content").classList.remove("hidden");
      generatePropertyTable();
    }
    // ================================== 
    function resetApp() {
      currentLanguage = "fr";
      document.getElementById("language-selection").classList.remove("hidden");
      document.getElementById("user-form").classList.add("hidden");
      document.getElementById("content").classList.add("hidden");
      document.getElementById("language").value = "";
      document.getElementById("username").value = "";
      document.getElementById("phone").value = "";
      document.getElementById("comments").value = "";
      document.getElementById("property-body").innerHTML = "";
    }
    // ================================== 
    function generatePropertyTable() {
      const t = translations[currentLanguage];
      const tbody = document.getElementById("property-body");
      tbody.innerHTML = "";
      properties.forEach((property, index) => {
        const row = document.createElement("tr");
        row.setAttribute("data-checked", "false");
        const key = property.keys[currentLanguage] || property.keys.fr;
        const title = property.titles[currentLanguage] || property.titles.fr;
        const description = property.descriptions[currentLanguage] || property.descriptions.fr;
        const area = property.areas[currentLanguage] || property.areas.fr;
        const price = property.prices[currentLanguage] || property.prices.fr;
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${key}</td>
          <td>${area}</td>
          <td>${price}</td>
          <td class="validate-cell"></td>
          <td class="proposal-cell"></td>
          <td class="cancel-cell"></td>
        `;
        // === Appliquer RTL au tableau si la langue est l'arabe ===
        const table = document.getElementById("property-table");
        if (currentLanguage === "ar") {
          table.classList.add("rtl-table");
          table.setAttribute("dir", "rtl");
        } else {
          table.classList.remove("rtl-table");
          table.removeAttribute("dir");
        }
        // ================================== 
        const validateBtn = document.createElement("button");
        validateBtn.innerText = t.validate;
        validateBtn.className = "btn";
        validateBtn.onclick = () => {
          row.querySelector(".validate-cell").innerText = row.cells[5].innerText;
          row.querySelector(".proposal-cell").innerHTML = "";
          row.querySelector(".cancel-cell").innerHTML = "";
          row.setAttribute("data-checked", "true");
        };
        const proposeBtn = document.createElement("button");
        proposeBtn.innerText = t.propose;
        proposeBtn.className = "btn";
        proposeBtn.onclick = () => {
          const input = document.createElement("input");
          input.type = "number";
          input.placeholder = t.propose + " un prix";
          input.style.width = "120px";
          //===================================
          const sendBtn = document.createElement("button");
          sendBtn.innerText = t.continue;
          sendBtn.className = "btn";
          sendBtn.onclick = () => {
            const value = input.value;
            if (!value || isNaN(value)) {
              alert(t.invalidPrice);
              return;
            }
            //
            row.querySelector(".proposal-cell").textContent = value + " DH";
            row.querySelector(".validate-cell").innerHTML = "";
            row.querySelector(".cancel-cell").innerHTML = "";
            row.setAttribute("data-checked", "true");
          };
          //===================================
          const proposalCell = row.querySelector(".proposal-cell");
          proposalCell.innerHTML = "";
          proposalCell.appendChild(input);
          proposalCell.appendChild(sendBtn);
          row.querySelector(".validate-cell").innerHTML = "";
          row.querySelector(".cancel-cell").innerHTML = "";
        };
        //===================================
        const cancelBtn = document.createElement("button");
        cancelBtn.innerText = t.cancel;
        cancelBtn.className = "btn";
        cancelBtn.onclick = () => {
          row.querySelector(".cancel-cell").innerText = t.noDesire;
          row.querySelector(".validate-cell").innerHTML = "";
          row.querySelector(".proposal-cell").innerHTML = "";
          row.setAttribute("data-checked", "true");
        };
        row.querySelector(".validate-cell").appendChild(validateBtn);
        row.querySelector(".proposal-cell").appendChild(proposeBtn);
        row.querySelector(".cancel-cell").appendChild(cancelBtn);
        tbody.appendChild(row);
      });
    }
    // = Enregistre la police "Amiri" avec pdfMake ====
    pdfMake.fonts = {
      Amiri: {
        normal: 'Amiri-Regular.ttf',
        bold: 'Amiri-Bold.ttf',
        italics: 'Amiri-Regular.ttf',
        bolditalics: 'Amiri-Bold.ttf'
      }
    };
    // == Fonction saveToPDF utilisant pdfMake ==
    function saveToPDF() {
      const t = translations[currentLanguage];
      const rows = document.querySelectorAll("#property-body tr");
      // Validation : toutes les lignes doivent être cochées
      for (const row of rows) {
        if (row.getAttribute("data-checked") !== "true") {
          alert(t.actionRequired);
          return;
        }
      }
      // Récupération des infos utilisateur avec valeurs par défaut traduites
      const nomUtilisateur = document.getElementById("username").value.trim() || `${t.nameLabel} Non renseigné`;
      const telephoneUtilisateur = document.getElementById("phone").value.trim() || `${t.phoneLabel} Non renseigné`;
      // Gestion des commentaires, texte par défaut si vide
      let commentaires = document.getElementById("comments").value.trim();
      if (!commentaires) {
        const noCommentText = generalTranslations.noComment[currentLanguage] || "Aucun commentaire";
        commentaires = (currentLanguage === "ar") ? fixArabicOrder(noCommentText) : noCommentText;
      }
      if (commentaires.length > 300) {
        alert(t.commentLengthExceeded || "Les commentaires ne doivent pas dépasser 300 caractères...");
        return;
      }
      // Fonction pour formater la date selon la langue
      const formatDate = (date, locale) =>
        date.toLocaleDateString(locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      const date = new Date();
      const pad = (n) => n.toString().padStart(2, "0");
      const filenameDate = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
      const filename = `Offre_${filenameDate}.pdf`;
      // Locale date pour chaque langue, ajustement pour arabe
      const localeForDate = currentLanguage === "ar" ? "ar-EG" : `${currentLanguage}-${currentLanguage.toUpperCase()}`;
      const rawDateStr = formatDate(date, localeForDate);
      const dateStr = currentLanguage === "ar" ? convertArabicDigitsToEnglish(rawDateStr) : rawDateStr;
      // Préparer les données du tableau
      const bodyData = [];
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        const bien = cells[1]?.innerText.trim() || "";
        const superficie = cells[2]?.innerText.trim() || "";
        const prix = cells[3]?.innerText.trim() || "";
        // Trouver la première colonne choix non vide parmi colonnes 4,5,6
        const choix = [4, 5, 6].map((i) => cells[i]?.innerText.trim() || "").find((text) => text !== "") || "";
 //       bodyData.push([bien, superficie, prix, choix]);
//     });
      
      
      bodyData.push([(bodyData.length + 1).toString(), bien, superficie, prix, choix]);

      });
      
      // Gestion RTL ou LTR selon langue
      const isRTL = ["ar", "he", "fa", "ur"].includes(currentLanguage);
      const align = isRTL ? "right" : "left";
      const dir = isRTL ? "rtl" : "ltr";
      // Gestion des lignes purchaseProcedure, qui peut être chaîne ou tableau
      let purchaseLines = [];
      if (Array.isArray(t.purchaseProcedure)) {
        purchaseLines = t.purchaseProcedure;
      } else if (typeof t.purchaseProcedure === "string") {
        purchaseLines = t.purchaseProcedure.split("\n");
      }
      // Création de la définition du document PDF
      const docDefinition = {
        defaultStyle: {
          font: "Amiri", // Assure-toi que la police supporte toutes tes langues
          alignment: align,
          direction: dir,
        },
        content: [{
            text: currentLanguage === "ar" ? fixArabicOrder(t.summaryTitle) : t.summaryTitle,
            style: "header",
            alignment: "center",
            direction: dir,
          },
          {
            text: isRTL ? [{
              text: fixArabicOrder(`${t.dateLabel} ${dateStr}`)
            }] : [{
                text: `${t.dateLabel} `,
                bold: true
              },
              {
                text: dateStr
              },
            ],
            style: "info",
            alignment: align,
            direction: dir,
          },
          {
            text: isRTL ? [{
              text: fixArabicOrder(`${t.nameLabel} ${nomUtilisateur}`)
            }] : [{
                text: `${t.nameLabel} `,
                bold: true
              },
              {
                text: nomUtilisateur
              },
            ],
            style: "info",
            alignment: align,
            direction: dir,
          },
          {
            text: isRTL ? [{
              text: fixArabicOrder(`${t.phoneLabel} ${telephoneUtilisateur}`)
            }] : [{
                text: `${t.phoneLabel} `,
                bold: true
              },
              {
                text: telephoneUtilisateur
              },
            ],
            style: "info",
            alignment: align,
            direction: dir,
          },
          {
            style: "tableExample",
            table: {
       //       widths: ["*", "*", "*", "*"],
              
              widths: ["auto", "*", "*", "*", "*"],

              body: [
                [
                  
                  
                  
                  
                  { 
                    text: t.tableHeaders[0] || "N°", 
                    alignment: "center",
                    direction: dir 
                  },
                  
                  
                  
                  
                  
                  
                  {
                    text: t.tableHeaders[1] || "Bien",
                    alignment: "center",
                    direction: dir
                  },
                  {
                    text: t.tableHeaders[2] || "Superficie",
                    alignment: "center",
                    direction: dir
                  },
                  {
                    text: t.tableHeaders[3] || "Prix",
                    alignment: "center",
                    direction: dir
                  },
                  {
                    text: t.choiceLabel || generalTranslations.choice[currentLanguage] || "Choix",
                    alignment: "center",
                    direction: dir,
                  },
                ],
                ...bodyData.map((row) =>
                  row.map((cell) => ({
                    text: cell,
                    alignment: align,
                    direction: dir,
                  }))
                ),
              ],
            },
            layout: {
              fillColor: (rowIndex) => (rowIndex === 0 ? "#2980B9" : rowIndex % 2 === 0 ? "#F0F0F0" : null),
            },
          },
          {
            text: t.commentsTitle || generalTranslations.commentsLabel[currentLanguage] || "Commentaires :",
            style: "commentsHeader",
            margin: [0, 15, 0, 5],
            alignment: align,
            direction: dir,
          },
          {
            text: isRTL ? [{
              text: fixArabicOrder(`${commentaires}`)
            }] : [{
              text: commentaires
            }, ],
            style: "info",
            alignment: align,
            direction: dir,
          },
          {
            text: currentLanguage === "ar" ? fixArabicOrder(t.purchaseProcedureTitle) : t.purchaseProcedureTitle,
            style: "purchaseTitle",
            margin: [0, 25, 0, 5],
            alignment: align,
            direction: dir,
          },
          {
            stack: purchaseLines.map((line) => ({
              text: currentLanguage === "ar" ? fixArabicOrder(line) : line,
            })),
            style: "purchaseText",
            alignment: align,
            direction: dir,
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
          },
          info: {
            fontSize: 11,
            bold: true,
            margin: [0, 3, 0, 3],
          },
          tableExample: {
            margin: [0, 15, 0, 0],
            fontSize: 10,
          },
          commentsHeader: {
            fontSize: 11,
            bold: true,
          },
          comments: {
            fontSize: 11,
          },
          purchaseTitle: {
            fontSize: 11,
            bold: true,
            italics: true,
          },
          purchaseText: {
            fontSize: 11,
            italics: true,
          },
          footer: {
            fontSize: 8,
            alignment: "right",
            margin: [0, 0, 14, 0],
          },
        },
        footer: (currentPage, pageCount) => ({
          text: `Page ${currentPage} / ${pageCount}`,
          style: "footer",
        }),
        pageMargins: [14, 20, 14, 20],
      };
      pdfMake.createPdf(docDefinition).download(filename);
      alert(`${t.pdfSaved} ${filename}`);
      resetApp();
    }
    // ====== Détection caractères arabes ===========
    function isArabic(text) {
      return /[\u0600-\u06FF]/.test(text);
    }
