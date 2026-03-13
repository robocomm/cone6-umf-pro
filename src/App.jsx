import React, { useState, useMemo, useEffect } from 'react';
import { Trash2, Plus, Download, Upload, Copy, BookOpen } from 'lucide-react';

export default function App() {
  const [recipe, setRecipe] = useState([]);
  const [newMaterialId, setNewMaterialId] = useState('feldspar-potash');
  const [newAmount, setNewAmount] = useState('');
  const [activeTab, setActiveTab] = useState('calculator');
  const [recipeName, setRecipeName] = useState('');
  const [recipeNotes, setRecipeNotes] = useState('');
  const [savedRecipes, setSavedRecipes] = useState([]);

  // Material database
  const materialsDB = [
    { id: 'feldspar-potash', name: 'Potassium Feldspar', type: 'Feldspar', oxides: { K2O: 0.118, Al2O3: 0.184, SiO2: 0.647 }, cost: 'Low' },
    { id: 'feldspar-soda', name: 'Sodium Feldspar', type: 'Feldspar', oxides: { Na2O: 0.110, Al2O3: 0.195, SiO2: 0.684 }, cost: 'Low' },
    { id: 'whiting', name: 'Whiting (CaCO3)', type: 'Flux', oxides: { CaO: 0.560 }, cost: 'Very Low' },
    { id: 'bone-ash', name: 'Bone Ash', type: 'Flux', oxides: { CaO: 0.500, P2O5: 0.350 }, cost: 'High' },
    { id: 'talc', name: 'Talc', type: 'Flux', oxides: { MgO: 0.317, SiO2: 0.636 }, cost: 'Low' },
    { id: 'dolomite', name: 'Dolomite', type: 'Flux', oxides: { CaO: 0.304, MgO: 0.219 }, cost: 'Low' },
    { id: 'soda-ash', name: 'Soda Ash (Na2CO3)', type: 'Flux', oxides: { Na2O: 0.585 }, cost: 'Low' },
    { id: 'strontium', name: 'Strontium Carbonate', type: 'Flux', oxides: { SrO: 0.704 }, cost: 'Medium' },
    { id: 'kaolin-epk', name: 'Kaolin (EPK)', type: 'Clay', oxides: { Al2O3: 0.395, SiO2: 0.458, K2O: 0.006 }, cost: 'Low' },
    { id: 'ball-clay', name: 'Ball Clay', type: 'Clay', oxides: { Al2O3: 0.370, SiO2: 0.500, K2O: 0.008, Fe2O3: 0.012 }, cost: 'Low' },
    { id: 'bentonite', name: 'Bentonite', type: 'Clay', oxides: { Al2O3: 0.439, SiO2: 0.499, K2O: 0.010 }, cost: 'Medium' },
    { id: 'silica', name: 'Silica (SiO2)', type: 'Silica', oxides: { SiO2: 1.000 }, cost: 'Low' },
    { id: 'tin', name: 'Tin Oxide', type: 'Opacifier', oxides: { SnO2: 1.000 }, cost: 'Very High' },
    { id: 'zircon', name: 'Zircon (Zircopax)', type: 'Opacifier', oxides: { ZrO2: 0.672, SiO2: 0.328 }, cost: 'Medium' },
    { id: 'iron-oxide', name: 'Iron Oxide (Fe2O3)', type: 'Colorant', oxides: { Fe2O3: 1.000 }, cost: 'Low' },
    { id: 'cobalt', name: 'Cobalt Carbonate', type: 'Colorant', oxides: { CoO: 0.774 }, cost: 'High' },
    { id: 'copper', name: 'Copper Carbonate', type: 'Colorant', oxides: { CuO: 0.799 }, cost: 'Medium' },
  ];

  const suggestedRecipes = [
    {
      id: 'clear-matte',
      name: 'Cone 6 Clear Matte',
      description: 'Classic satin clear glaze. Perfect base for testing colorants.',
      ingredients: [
        { materialId: 'feldspar-potash', amount: 30 },
        { materialId: 'whiting', amount: 25 },
        { materialId: 'kaolin-epk', amount: 20 },
        { materialId: 'silica', amount: 25 }
      ],
      notes: 'Reliable matte surface. Slight crazing possible—add 2% bentonite if needed.',
      surface: 'Matte'
    },
    {
      id: 'satin-clear',
      name: 'Cone 6 Satin Clear',
      description: 'Smooth, silky clear glaze with subtle sheen.',
      ingredients: [
        { materialId: 'feldspar-potash', amount: 35 },
        { materialId: 'whiting', amount: 20 },
        { materialId: 'talc', amount: 8 },
        { materialId: 'kaolin-epk', amount: 18 },
        { materialId: 'silica', amount: 19 }
      ],
      notes: 'Excellent base for cobalt and other oxides. Very stable.',
      surface: 'Satin'
    },
    {
      id: 'glossy-clear',
      name: 'Cone 6 Glossy Clear',
      description: 'Bright glossy clear. Good for bright colorants.',
      ingredients: [
        { materialId: 'feldspar-potash', amount: 40 },
        { materialId: 'feldspar-soda', amount: 10 },
        { materialId: 'whiting', amount: 22 },
        { materialId: 'kaolin-epk', amount: 15 },
        { materialId: 'silica', amount: 13 }
      ],
      notes: 'Runs slightly. Avoid on vertical surfaces above 10 degrees.',
      surface: 'Glossy'
    },
    {
      id: 'matt-white',
      name: 'Cone 6 Matte White',
      description: 'Opaque white matte glaze.',
      ingredients: [
        { materialId: 'feldspar-potash', amount: 28 },
        { materialId: 'whiting', amount: 27 },
        { materialId: 'kaolin-epk', amount: 22 },
        { materialId: 'silica', amount: 20 },
        { materialId: 'zircon', amount: 3 }
      ],
      notes: 'Beautiful warm white. Zircon provides opacity. Can substitute tin for cooler white.',
      surface: 'Matte White'
    },
    {
      id: 'iron-matte',
      name: 'Cone 6 Iron Matte',
      description: 'Warm brown matte with iron oxide.',
      ingredients: [
        { materialId: 'feldspar-potash', amount: 30 },
        { materialId: 'whiting', amount: 25 },
        { materialId: 'talc', amount: 10 },
        { materialId: 'kaolin-epk', amount: 20 },
        { materialId: 'silica', amount: 13 },
        { materialId: 'iron-oxide', amount: 2 }
      ],
      notes: 'Rich brown. Increase iron to 3% for darker tones. Decrease talc if too matte.',
      surface: 'Matte Brown'
    },
    {
      id: 'cobalt-blue',
      name: 'Cone 6 Cobalt Blue Base',
      description: 'Bright cobalt blue satin glaze.',
      ingredients: [
        { materialId: 'feldspar-potash', amount: 35 },
        { materialId: 'whiting', amount: 20 },
        { materialId: 'talc', amount: 5 },
        { materialId: 'kaolin-epk', amount: 18 },
        { materialId: 'silica', amount: 20 },
        { materialId: 'cobalt', amount: 0.5 }
      ],
      notes: 'Start with 0.5% cobalt. Increase for deeper blue (max ~1.5%). Very stable.',
      surface: 'Satin Blue'
    },
    {
      id: 'testing-base',
      name: 'Cone 6 Testing Base',
      description: 'Neutral base for testing new materials and colorants.',
      ingredients: [
        { materialId: 'feldspar-potash', amount: 32 },
        { materialId: 'whiting', amount: 23 },
        { materialId: 'kaolin-epk', amount: 20 },
        { materialId: 'silica', amount: 20 },
        { materialId: 'bentonite', amount: 1 }
      ],
      notes: 'Stable, reliable base. Bentonite improves suspension.',
      surface: 'Matte-Satin'
    }
  ];

  const cone6Targets = {
    CaO: { min: 0.70, target: 0.75, max: 0.85, label: 'Calcium' },
    MgO: { min: 0.00, target: 0.05, max: 0.10, label: 'Magnesium' },
    K2O: { min: 0.05, target: 0.10, max: 0.15, label: 'Potassium' },
    Na2O: { min: 0.00, target: 0.05, max: 0.10, label: 'Sodium' },
    Al2O3: { min: 0.25, target: 0.30, max: 0.35, label: 'Alumina' },
    SiO2: { min: 3.0, target: 3.5, max: 4.5, label: 'Silica' },
  };

  const molecularWeights = {
    K2O: 94.2, Na2O: 61.98, CaO: 56.08, MgO: 40.30, SrO: 103.64,
    Al2O3: 101.96, SiO2: 60.08, Fe2O3: 159.69, CoO: 74.93, CuO: 79.55,
    SnO2: 150.71, ZrO2: 123.22, P2O5: 141.94
  };

  // Load recipes from storage on mount
  useEffect(() => {
    loadRecipes();
  }, []);

  // Storage functions
  const loadRecipes = async () => {
    try {
      const result = await window.storage.get('cone6-recipes');
      if (result && result.value) {
        setSavedRecipes(JSON.parse(result.value));
      }
    } catch (err) {
      console.log('No saved recipes yet');
    }
  };

  const saveRecipesToStorage = async (recipes) => {
    try {
      await window.storage.set('cone6-recipes', JSON.stringify(recipes));
    } catch (err) {
      console.error('Error saving recipes', err);
    }
  };

  // Calculate UMF - moved inside useMemo to avoid dependency issues
  const umfResult = useMemo(() => {
    if (recipe.length === 0) return null;

    let totalOxides = {};

    recipe.forEach(item => {
      const material = materialsDB.find(m => m.id === item.materialId);
      if (!material) return;

      Object.entries(material.oxides).forEach(([oxide, percentage]) => {
        const weight = item.amount * percentage;
        const mw = molecularWeights[oxide];
        const moles = weight / mw;
        
        totalOxides[oxide] = (totalOxides[oxide] || 0) + moles;
      });
    });

    const roMoles = (totalOxides.CaO || 0) + (totalOxides.MgO || 0) + 
                    (totalOxides.K2O || 0) + (totalOxides.Na2O || 0) + 
                    (totalOxides.SrO || 0);
    
    if (roMoles === 0) return null;

    const umf = {};
    Object.entries(totalOxides).forEach(([oxide, moles]) => {
      umf[oxide] = moles / roMoles;
    });

    return { umf, roMoles };
  }, [recipe]);

  const addMaterial = () => {
    if (!newAmount || isNaN(newAmount) || parseFloat(newAmount) <= 0) return;
    setRecipe([...recipe, { materialId: newMaterialId, amount: parseFloat(newAmount) }]);
    setNewAmount('');
  };

  const removeMaterial = (idx) => {
    setRecipe(recipe.filter((_, i) => i !== idx));
  };

  const getMaterialName = (id) => {
    return materialsDB.find(m => m.id === id)?.name || 'Unknown';
  };

  const saveRecipe = () => {
    if (!recipeName || recipe.length === 0) {
      alert('Please enter a recipe name and add ingredients');
      return;
    }

    const newRecipe = {
      id: `recipe-${Date.now()}`,
      name: recipeName,
      ingredients: [...recipe],
      notes: recipeNotes,
      createdAt: new Date().toLocaleDateString(),
      umf: umfResult
    };

    const updated = [...savedRecipes, newRecipe];
    setSavedRecipes(updated);
    saveRecipesToStorage(updated);

    setRecipeName('');
    setRecipeNotes('');
    setRecipe([]);
    alert('Recipe saved!');
  };

  const loadRecipe = (recipeId) => {
    const recipeData = savedRecipes.find(r => r.id === recipeId);
    if (recipeData) {
      setRecipe(recipeData.ingredients);
      setRecipeName(recipeData.name);
      setRecipeNotes(recipeData.notes);
      setActiveTab('calculator');
    }
  };

  const loadSuggestedRecipe = (recipe) => {
    setRecipe(recipe.ingredients);
    setRecipeName(recipe.name);
    setRecipeNotes(recipe.notes);
    setActiveTab('calculator');
  };

  const deleteRecipe = (id) => {
    const updated = savedRecipes.filter(r => r.id !== id);
    setSavedRecipes(updated);
    saveRecipesToStorage(updated);
  };

  const exportRecipe = () => {
    if (!recipeName || recipe.length === 0) {
      alert('Create a recipe first');
      return;
    }

    const data = {
      name: recipeName,
      ingredients: recipe,
      notes: recipeNotes,
      umf: umfResult
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipeName.replace(/\s+/g, '-')}.json`;
    a.click();
  };

  const isInRange = (value, min, max) => {
    return value >= min && value <= max;
  };

  const getStatusColor = (value, min, target, max) => {
    if (isInRange(value, min, max)) {
      if (Math.abs(value - target) < 0.02) return '#2D8A3D';
      return '#6DB876';
    }
    return '#C74E4E';
  };

  return (
    <div style={{ '--clay': '#3D3028', '--light': '#FAF7F2', '--earth': '#C7956B', '--sage': '#8FA68E', '--good': '#2D8A3D', '--warn': '#C74E4E' }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: linear-gradient(135deg, #FAF7F2 0%, #F0E8DE 100%); font-family: 'Crimson Text', serif; min-height: 100vh; }
        
        .app { max-width: 1600px; margin: 0 auto; padding: 40px 20px; }
        
        .header { text-align: center; margin-bottom: 50px; }
        .header h1 { font-size: 3.2rem; color: var(--clay); font-weight: 400; font-family: 'Playfair Display', serif; margin-bottom: 8px; }
        .header p { color: #888; font-size: 1.05rem; font-weight: 300; }
        
        .tabs { display: flex; gap: 0; margin-bottom: 30px; border-bottom: 2px solid #E8DFD5; }
        .tab { padding: 16px 24px; cursor: pointer; font-size: 1rem; color: #999; border-bottom: 3px solid transparent; transition: all 0.3s; }
        .tab.active { color: var(--clay); border-bottom-color: var(--earth); font-weight: 600; }
        
        .tab-content { display: none; }
        .tab-content.active { display: block; }
        
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
        @media (max-width: 1200px) { .grid { grid-template-columns: 1fr; } }
        
        .panel { background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 20px rgba(0,0,0,0.08); border: 1px solid #E8DFD5; }
        
        .panel-title { font-size: 1.3rem; color: var(--clay); margin-bottom: 20px; font-weight: 600; }
        
        .recipe-input { display: grid; grid-template-columns: 1fr 120px 40px; gap: 12px; margin-bottom: 20px; }
        
        .select, .input, .textarea { padding: 10px 12px; border: 2px solid #E8DFD5; border-radius: 6px; font-family: inherit; font-size: 0.95rem; }
        .textarea { resize: vertical; font-family: inherit; min-height: 80px; }
        .select:focus, .input:focus, .textarea:focus { outline: none; border-color: var(--earth); box-shadow: 0 0 0 3px rgba(199,149,107,0.1); }
        
        .btn { padding: 10px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: all 0.2s; }
        .btn-primary { background: var(--earth); color: white; }
        .btn-primary:hover { background: #B88455; }
        .btn-secondary { background: #F0E8DE; color: var(--clay); border: 2px solid #E8DFD5; }
        .btn-secondary:hover { background: #E8DFD5; }
        .btn-small { padding: 6px 12px; font-size: 0.85rem; }
        .btn-danger { background: transparent; color: #C74E4E; border: 2px solid #C74E4E; padding: 6px 10px; }
        .btn-danger:hover { background: #C74E4E; color: white; }
        
        .recipe-list { display: flex; flex-direction: column; gap: 10px; }
        .recipe-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #F5EFE7; border-radius: 6px; border-left: 4px solid var(--earth); }
        .recipe-item-info { flex: 1; }
        .recipe-item-name { font-weight: 600; color: var(--clay); }
        .recipe-item-amount { color: #888; font-size: 0.9rem; margin-top: 2px; }
        
        .umf-display { background: linear-gradient(135deg, #FAF7F2 0%, #F5EFE7 100%); border: 2px solid var(--earth); border-radius: 8px; padding: 30px; }
        
        .umf-header { margin-bottom: 25px; }
        .umf-formula { font-size: 1.6rem; color: var(--clay); font-weight: 600; font-family: 'Courier New', monospace; margin-bottom: 12px; }
        .umf-formula-small { font-size: 1.1rem; color: #666; font-family: 'Courier New', monospace; }
        
        .umf-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; margin-top: 20px; }
        
        .umf-item { padding: 15px; background: white; border-radius: 6px; border-top: 3px solid #DDD; }
        .umf-item.flux { border-top-color: #FF6B35; }
        .umf-item.alumina { border-top-color: #6DB876; }
        .umf-item.silica { border-top-color: #4A90E2; }
        
        .umf-label { font-size: 0.8rem; color: #888; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .umf-value { font-size: 1.3rem; color: var(--clay); font-weight: 600; font-family: 'Courier New', monospace; }
        
        .status-badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 0.7rem; font-weight: 600; margin-top: 6px; text-transform: uppercase; }
        .in-range { background: #E8F5E9; color: #2D8A3D; }
        .out-range { background: #FFEBEE; color: #C74E4E; }
        
        .recipe-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        
        .recipe-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 20px rgba(0,0,0,0.08); border: 1px solid #E8DFD5; transition: all 0.3s; cursor: pointer; }
        .recipe-card:hover { box-shadow: 0 4px 30px rgba(199,149,107,0.15); transform: translateY(-2px); }
        
        .recipe-card-title { font-size: 1.1rem; font-weight: 600; color: var(--clay); margin-bottom: 8px; }
        .recipe-card-description { color: #888; font-size: 0.9rem; margin-bottom: 12px; line-height: 1.4; }
        .recipe-card-meta { display: flex; gap: 12px; font-size: 0.85rem; color: #999; margin-bottom: 12px; }
        
        .recipe-card-actions { display: flex; gap: 8px; }
        
        .empty-state { text-align: center; padding: 40px 20px; color: #999; font-style: italic; }
        
        .notes-box { margin-top: 20px; padding: 15px; background: #FFF9E6; border-left: 4px solid #FFB81C; border-radius: 4px; font-size: 0.9rem; color: #5C4A00; }
        
        .form-group { margin-bottom: 20px; }
        .form-label { display: block; font-weight: 600; color: var(--clay); margin-bottom: 8px; font-size: 0.95rem; }
      `}</style>

      <div className="app">
        <div className="header">
          <h1>Cone 6 UMF Pro</h1>
          <p>Recipe Calculator, Library & Storage</p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <div 
            className={`tab ${activeTab === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculator')}
          >
            Calculator
          </div>
          <div 
            className={`tab ${activeTab === 'myRecipes' ? 'active' : ''}`}
            onClick={() => setActiveTab('myRecipes')}
          >
            My Recipes ({savedRecipes.length})
          </div>
          <div 
            className={`tab ${activeTab === 'library' ? 'active' : ''}`}
            onClick={() => setActiveTab('library')}
          >
            <BookOpen size={16} style={{ display: 'inline', marginRight: '6px' }} />
            Recipe Library
          </div>
        </div>

        {/* Calculator Tab */}
        <div className={`tab-content ${activeTab === 'calculator' ? 'active' : ''}`}>
          <div className="grid">
            {/* Input */}
            <div className="panel">
              <div className="panel-title">Recipe Builder</div>
              
              <div className="form-group">
                <label className="form-label">Recipe Name</label>
                <input
                  type="text"
                  placeholder="e.g., Clear Matte Base"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="input"
                  style={{ width: '100%' }}
                />
              </div>

              <div className="recipe-input">
                <select 
                  value={newMaterialId} 
                  onChange={(e) => setNewMaterialId(e.target.value)}
                  className="select"
                >
                  {materialsDB.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Grams"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="input"
                  onKeyPress={(e) => e.key === 'Enter' && addMaterial()}
                />
                <button onClick={addMaterial} className="btn btn-primary" style={{ padding: '10px' }}>
                  <Plus size={18} />
                </button>
              </div>

              {recipe.length > 0 && (
                <div className="recipe-list">
                  {recipe.map((item, idx) => (
                    <div key={idx} className="recipe-item">
                      <div className="recipe-item-info">
                        <div className="recipe-item-name">{getMaterialName(item.materialId)}</div>
                        <div className="recipe-item-amount">{item.amount.toFixed(1)}g</div>
                      </div>
                      <button 
                        onClick={() => removeMaterial(idx)}
                        className="btn btn-danger btn-small"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="form-group" style={{ marginTop: '20px' }}>
                <label className="form-label">Notes</label>
                <textarea
                  placeholder="Test results, observations, adjustments..."
                  value={recipeNotes}
                  onChange={(e) => setRecipeNotes(e.target.value)}
                  className="textarea"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={saveRecipe} className="btn btn-primary" style={{ flex: 1 }}>
                  💾 Save Recipe
                </button>
                <button onClick={exportRecipe} className="btn btn-secondary btn-small">
                  <Download size={14} />
                </button>
              </div>
            </div>

            {/* UMF Display */}
            <div className="panel">
              {umfResult ? (
                <div className="umf-display">
                  <div className="umf-header">
                    <div className="umf-formula">RO : Al₂O₃ : SiO₂</div>
                    <div className="umf-formula-small">
                      1.0 : {(umfResult.umf.Al2O3 || 0).toFixed(3)} : {(umfResult.umf.SiO2 || 0).toFixed(2)}
                    </div>
                  </div>

                  <div className="umf-grid">
                    {['CaO', 'MgO', 'K2O', 'Na2O'].map(oxide => {
                      const value = umfResult.umf[oxide] || 0;
                      const target = cone6Targets[oxide];
                      const color = getStatusColor(value, target.min, target.target, target.max);
                      const pct = (value * 100).toFixed(1);
                      
                      return (
                        <div key={oxide} className="umf-item flux">
                          <div className="umf-label">{target.label}</div>
                          <div className="umf-value" style={{ color }}>{pct}%</div>
                          <div className={`status-badge ${isInRange(value, target.min, target.max) ? 'in-range' : 'out-range'}`}>
                            {isInRange(value, target.min, target.max) ? '✓' : '⚠'}
                          </div>
                        </div>
                      );
                    })}

                    {(() => {
                      const value = umfResult.umf.Al2O3 || 0;
                      const target = cone6Targets.Al2O3;
                      const color = getStatusColor(value, target.min, target.target, target.max);
                      
                      return (
                        <div className="umf-item alumina">
                          <div className="umf-label">Alumina</div>
                          <div className="umf-value" style={{ color }}>{value.toFixed(3)}</div>
                          <div className={`status-badge ${isInRange(value, target.min, target.max) ? 'in-range' : 'out-range'}`}>
                            {isInRange(value, target.min, target.max) ? '✓' : '⚠'}
                          </div>
                        </div>
                      );
                    })()}

                    {(() => {
                      const value = umfResult.umf.SiO2 || 0;
                      const target = cone6Targets.SiO2;
                      const color = getStatusColor(value, target.min, target.target, target.max);
                      
                      return (
                        <div className="umf-item silica">
                          <div className="umf-label">Silica</div>
                          <div className="umf-value" style={{ color }}>{value.toFixed(2)}</div>
                          <div className={`status-badge ${isInRange(value, target.min, target.max) ? 'in-range' : 'out-range'}`}>
                            {isInRange(value, target.min, target.max) ? '✓' : '⚠'}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="notes-box">
                    <strong>Cone 6 Targets:</strong><br/>
                    Fluxes 95-100% | Al₂O₃ 0.25-0.35 | SiO₂ 3.0-4.5
                  </div>
                </div>
              ) : (
                <div className="empty-state">Enter recipe to see UMF analysis</div>
              )}
            </div>
          </div>
        </div>

        {/* My Recipes Tab */}
        <div className={`tab-content ${activeTab === 'myRecipes' ? 'active' : ''}`}>
          {savedRecipes.length > 0 ? (
            <div className="recipe-cards">
              {savedRecipes.map(recipe => (
                <div key={recipe.id} className="recipe-card">
                  <div className="recipe-card-title">{recipe.name}</div>
                  <div className="recipe-card-meta">
                    <span>📅 {recipe.createdAt}</span>
                  </div>
                  {recipe.notes && (
                    <div className="recipe-card-description">{recipe.notes}</div>
                  )}
                  <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '12px' }}>
                    {recipe.ingredients.length} ingredients
                  </div>
                  <div className="recipe-card-actions">
                    <button 
                      onClick={() => loadRecipe(recipe.id)}
                      className="btn btn-secondary btn-small"
                      style={{ flex: 1 }}
                    >
                      Load
                    </button>
                    <button 
                      onClick={() => deleteRecipe(recipe.id)}
                      className="btn btn-danger btn-small"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="panel">
              <div className="empty-state">No saved recipes yet. Create one in the Calculator tab!</div>
            </div>
          )}
        </div>

        {/* Library Tab */}
        <div className={`tab-content ${activeTab === 'library' ? 'active' : ''}`}>
          <div className="recipe-cards">
            {suggestedRecipes.map(recipe => (
              <div key={recipe.id} className="recipe-card">
                <div className="recipe-card-title">{recipe.name}</div>
                <div className="recipe-card-description">{recipe.description}</div>
                <div className="recipe-card-meta">
                  <span>🎨 {recipe.surface}</span>
                  <span>📦 {recipe.ingredients.length} items</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '12px', lineHeight: '1.5' }}>
                  {recipe.notes}
                </div>
                <button 
                  onClick={() => loadSuggestedRecipe(recipe)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Load Recipe
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
