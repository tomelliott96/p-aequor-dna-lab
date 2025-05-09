const returnRandBase = () => {
    const dnaBases = ['A', 'T', 'C', 'G'];
    return dnaBases[Math.floor(Math.random() * 4)];
  };
  
  const mockUpStrand = () => {
    const newStrand = [];
    for (let i = 0; i < 15; i++) {
      newStrand.push(returnRandBase());
    }
    return newStrand;
  };
  
  const pAequorFactory = (specimenNum, dna) => {
    return {
      specimenNum,
      dna,
  
      mutate() {
        const randomIndex = Math.floor(Math.random() * this.dna.length);
        let newBase = returnRandBase();
        while (this.dna[randomIndex] === newBase) {
          newBase = returnRandBase();
        }
        const oldBase = this.dna[randomIndex];
        this.dna[randomIndex] = newBase;
        return { oldBase, newBase, index: randomIndex };
      },
  
      willLikelySurvive() {
        const cgCount = this.dna.filter(b => b === 'C' || b === 'G').length;
        const percentage = ((cgCount / this.dna.length) * 100).toFixed(2);
        const survives = (cgCount / this.dna.length) >= 0.6;
        return { percentage, survives };
      }
    };
  };
  
  const originalContainer = document.getElementById('original-sequence');
  const mutatedContainer = document.getElementById('mutated-sequence');
  const survivalResult = document.getElementById('survival-result');
  const survivalStatus = document.getElementById('survival-status');
  const survivalStory = document.getElementById('survival-story');
  const mutationSection = document.getElementById('mutation-section');
  const survivalSection = document.getElementById('survival-section');
  
  let currentOrganism = null;
  
  const renderDNA = (container, dna, highlightIndex = null) => {
    container.innerHTML = '';
    dna.forEach((base, i) => {
      const span = document.createElement('span');
      span.textContent = base;
      span.className = `base ${base}`;
      if (i === highlightIndex) {
        span.style.border = '2px solid red';
        span.style.borderRadius = '4px';
      }
      container.appendChild(span);
    });
  };
  
  document.getElementById('generate').addEventListener('click', () => {
    const dna = mockUpStrand();
    currentOrganism = pAequorFactory(1, [...dna]);
  
    document.getElementById('original-dna').hidden = false;
    mutationSection.hidden = false;
    survivalSection.hidden = true;
    document.getElementById('mutated-dna').hidden = true;
    survivalResult.hidden = true;
  
    renderDNA(originalContainer, dna);
  
    document.getElementById('mutate').disabled = false;
    document.getElementById('check').disabled = true;
  
    document.getElementById('original-dna').scrollIntoView({ behavior: 'smooth' });
  });
  
  document.getElementById('mutate').addEventListener('click', () => {
    if (currentOrganism) {
      const { index } = currentOrganism.mutate();
      document.getElementById('mutated-dna').hidden = false;
      survivalSection.hidden = false;
      renderDNA(mutatedContainer, currentOrganism.dna, index);
  
      document.getElementById('check').disabled = false;
  
      document.getElementById('mutated-dna').scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  document.getElementById('check').addEventListener('click', () => {
    if (currentOrganism) {
      const { percentage, survives } = currentOrganism.willLikelySurvive();
      survivalResult.hidden = false;
  
      const facts = `
        <p><strong>🧬 Survival Report</strong></p>
        <ul>
          <li><strong>C/G Base Ratio:</strong> ${percentage}%</li>
          <li><strong>Required Threshold:</strong> 60%</li>
          <li><strong>Status:</strong> ${survives ? '✅ Likely to Survive' : '❌ Unlikely to Survive'}</li>
        </ul>`;
  
      const story = survives
        ? "With such a strong genetic profile, this specimen is ready to take on the deep! Let's hope we meet more like this one."
        : "Its genetic structure just isn't robust enough. In the wild, it would struggle to adapt to the harsh conditions of the deep sea.";
  
      survivalStatus.innerHTML = facts;
      survivalStory.textContent = story;
  
      survivalResult.scrollIntoView({ behavior: 'smooth' });
    }
  });
  