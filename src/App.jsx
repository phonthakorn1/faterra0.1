  }, []);
  const saveEquipTxns = useCallback((next) => {
    setEquipTxns(next);
    storageSave(STORAGE_KEYS.equipTxns, next);
  }, []);
  const saveSettings = useCallback((next) => {
    setSettings(next);
    storageSave(STORAGE_KEYS.settings, next);
  }, []);
  const saveCashEntries = useCallback((next) => {
    setCashEntries(next);
    storageSave(STORAGE_KEYS.cashEntries, next);
  }, []);

  return (
    <div className="ca-root">
      <style>{CSS}</style>
      <aside className="ca-sidebar ca-no-print">
        <div className="ca-brand">
          <img src={FATERRA_LOGO} alt="FATERRA" className="ca-brand-mark" />
          <div>
            <div className="ca-brand-name">FATERRA</div>
            <div className="ca-brand-sub">Building a Greater Tomorrow</div>
          </div>
        </div>
        <nav className="ca-nav">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={'ca-nav-btn' + (tab === n.id ? ' active' : '')}
              onClick={() => setTab(n.id)}
            >
              <n.icon size={16} /> {n.label}
            </button>
          ))}
        </nav>
        <div className="ca-nav-spacer" />
        <button className="ca-nav-btn" onClick={() => setShowSettings(true)}>
          <Settings size={16} /> ข้อมูลบริษัท/บัญชี
        </button>
        <div className="ca-nav-foot">
          ข้อมูลบันทึกอัตโนมัติ
          <br />
          ในเบราว์เซอร์ของคุณ
        </div>
      </aside>

      <main className="ca-main">
        {loading ? (
          <div className="ca-loading">
            <Loader2
              size={20}
              className="ca-spin"
              style={{ animation: 'spin 1s linear infinite' }}
            />{' '}
            กำลังโหลดข้อมูล...
          </div>
        ) : tab === 'dashboard' ? (
          <Dashboard
            stock={stock}
            quotes={quotes}
            jobs={jobs}
            txns={txns}
            equipment={equipment}
            equipTxns={equipTxns}
            cashEntries={cashEntries}
            setTab={setTab}
          />
        ) : tab === 'stock' ? (
          <StockView
            stock={stock}
            saveStock={saveStock}
            txns={txns}
            saveTxns={saveTxns}
            jobs={jobs}
            equipment={equipment}
            saveEquipment={saveEquipment}
            equipTxns={equipTxns}
            saveEquipTxns={saveEquipTxns}
          />
        ) : tab === 'quotes' ? (
          <QuotationsView
            quotes={quotes}
            saveQuotes={saveQuotes}
            stock={stock}
            jobs={jobs}
            saveJobs={saveJobs}
            settings={settings}
            onOpenSettings={() => setShowSettings(true)}
          />
        ) : tab === 'jobs' ? (
          <JobsView
            jobs={jobs}
            saveJobs={saveJobs}
            txns={txns}
            equipTxns={equipTxns}
            quotes={quotes}
            stock={stock}
            cashEntries={cashEntries}
          />
        ) : (
          <CashFlowView
            entries={cashEntries}
            saveEntries={saveCashEntries}
            jobs={jobs}
          />
        )}
      </main>
      {showSettings && (
        <SettingsModal
          settings={settings}
          saveSettings={saveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
