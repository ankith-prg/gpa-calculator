let semCount = 1;

function setupRowListeners(semId) {
    const semCard = document.getElementById(`sem-${semId}`);
    const rows = semCard.querySelectorAll('.input-row');
    rows.forEach(row => {
        const nInp = row.querySelector('.sub-name');
        const cInp = row.querySelector('.sub-credits');
        const mInp = row.querySelector('.sub-marks');

        nInp.oninput = () => { nInp.value = nInp.value.replace(/[0-9]/g, '').toUpperCase(); };
        cInp.oninput = () => { cInp.value = cInp.value.replace(/[^0-9]/g, ''); };
        mInp.oninput = () => { mInp.value = mInp.value.replace(/[^0-9]/g, ''); };

        nInp.onkeydown = (e) => { if(e.key === 'Enter') cInp.focus(); };
        cInp.onkeydown = (e) => { if(e.key === 'Enter') mInp.focus(); };
        mInp.onkeydown = (e) => { if(e.key === 'Enter') mInp.blur(); };
    });
}

function addNewSemester() {
    if (semCount < 8) {
        semCount++;
        const html = `
            <div class="sem-card neumorphic" id="sem-${semCount}">
                <div class="sem-header"><h3>SEMESTER ${semCount}</h3></div>
                <div class="row-header">
                    <div>Subject</div><div>Credits</div><div>Marks</div><div></div>
                </div>
                <div class="subject-list" id="list-${semCount}">
                    <div class="input-row">
                        <input type="text" placeholder="SUBJECT" class="sub-name">
                        <input type="text" placeholder="0" class="sub-credits">
                        <input type="text" placeholder="0-100" class="sub-marks">
                        <div class="row-action-spacer"></div>
                    </div>
                </div>
                <div class="sem-actions">
                    <button onclick="addSubject(${semCount})" class="btn-outline">Add Subject</button>
                    <button onclick="calculateSGPA(${semCount})" class="btn-success shadow-btn">Calculate SGPA</button>
                    <button onclick="addNewSemester()" class="btn-primary shadow-btn">Add Next Sem</button>
                    <button onclick="deleteSem(${semCount})" class="btn-clear-theme shadow-btn" style="width:auto; padding:10px">Delete Sem</button>
                </div>
                <div id="error-${semCount}" class="error-msg"></div>
                <div class="result-display">SGPA: <span id="sgpa-val-${semCount}">0.00</span></div>
            </div>`;
        document.getElementById('sgpa-container').insertAdjacentHTML('beforeend', html);
        setupRowListeners(semCount);
    }
}

function addSubject(semId) {
    const list = document.getElementById(`list-${semId}`);
    const row = document.createElement('div');
    row.className = 'input-row';
    row.innerHTML = `
        <input type="text" placeholder="SUBJECT" class="sub-name">
        <input type="text" placeholder="0" class="sub-credits">
        <input type="text" placeholder="0-100" class="sub-marks">
        <button class="btn-delete-row" onclick="this.closest('.input-row').remove()">×</button>
    `;
    list.appendChild(row);
    setupRowListeners(semId);
    row.querySelector('.sub-name').focus();
}

function calculateSGPA(semId) {
    const semCard = document.getElementById(`sem-${semId}`);
    const rows = semCard.querySelectorAll('.input-row');
    const err = document.getElementById(`error-${semId}`);
    err.innerText = ""; let tC = 0, tP = 0, hasErr = false;

    rows.forEach(row => {
        const cInp = row.querySelector('.sub-credits'), mInp = row.querySelector('.sub-marks'), nInp = row.querySelector('.sub-name');
        if(!nInp.value || !cInp.value || !mInp.value) {
            cInp.classList.add('invalid-input'); mInp.classList.add('invalid-input');
            setTimeout(() => { cInp.classList.remove('invalid-input'); mInp.classList.remove('invalid-input'); }, 2000);
            hasErr = true; return;
        }
        const c = parseInt(cInp.value), m = parseInt(mInp.value);
        if(m < 0 || m > 100 || c <= 0) { err.innerText = "Check your data!"; hasErr = true; }
        if(!hasErr) {
            let gp = m >= 40 ? Math.floor(m / 10) + 1 : 0; if(m >= 90) gp = 10;
            tP += (gp * c); tC += c;
        }
    });
    if(!hasErr && tC > 0) {
        document.getElementById(`sgpa-val-${semId}`).innerText = (tP / tC).toFixed(2);
        document.getElementById('popup-overlay').style.display = 'flex';
    }
}

function calculateTotalCGPA() {
    const vals = document.querySelectorAll('[id^="sgpa-val-"]');
    let t = 0, c = 0;
    vals.forEach(v => { let n = parseFloat(v.innerText); if(n > 0){ t += n; c++; }});
    document.getElementById('total-cgpa').innerText = c > 0 ? (t/c).toFixed(2) : "0.00";
}

function closePopup() { document.getElementById('popup-overlay').style.display = 'none'; }
function deleteSem(id) { document.getElementById(`sem-${id}`).remove(); }
function clearAllData() { if(confirm("Clear all?")) location.reload(); }

setupRowListeners(1);