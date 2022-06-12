console.log('Starting my plugin');

var x = chrome.tabGroups;

var isCreatingBackup = false;

function backupNow(isAutomatic, backupID, callbackDone) 
{
  console.log('backupNow - isAutomatic: ' + isAutomatic + ' ID: ' + backupID);

  if (isCreatingBackup === true) 
  {
    console.log('backupNow - already running. Skipping..');
    return;
  }
  isCreatingBackup = true;

  // start work
  // first go through all windows
  chrome.windows.getAll({windowTypes: ['normal'], populate : true}, function (window_list) 
  {
    var backupListItem = {id: backupID, name: null};

    var fullBackup = {
      windows: [],
      isAutomatic: (isAutomatic !== false),
      totNumTabs: 0
    };

    var windowToBackup, windowTabs, bkpWindow;
    var tab, bkpTab;

    for (var i = 0; i < window_list.length; i++) 
    {
      console.log ('backupNow Window #' + i);

      windowToBackup = window_list[i];
      windowTabs     = windowToBackup.tabs;
      bkpWindow = {
        incognito: !!windowToBackup.incognito,
        tabs: [],
        groups: [],
      };

      for (var j = 0; j < windowTabs.length; j++) 
      {
        tab = windowTabs[j];

        console.log('==> Tab ' + j + ' (' + tab.index + '): ' + tab.url);

        bkpTab = {
          url: tab.url,
          title: tab.title,
          grp: tab.groupId,
        };

        // Add tab to tabs arrays
        bkpWindow.tabs.push(bkpTab);

        if (tab.groupId != chrome.tabGroups.TAB_GROUP_ID_NONE)
        {
            chrome.tabGroups.get(tab.groupId, function (tabGroup)
            {
                // so, dass ist ja schon wieder eine async Funktion
                // Wie kann ich hier auf das Ergebnis "warten", denn bevor die tabGroup-Daten nicht vorliegen, kann ich nicht weiter machen.
                bkpWindow.groups.push(tabGroup);
            });
        }
      }

      fullBackup.totNumTabs += windowTabs.length;
      fullBackup.windows.push(bkpWindow);
    }

    /*
    var backupListItemArray, fullBackupArray, callbackDoneWrapper;
    backupListItemArray = [backupListItem];
    fullBackupArray     = [fullBackup];
    callbackDoneWrapper = function(isSuccess, backupList, storageSetValues) {
      isCreatingBackup = false;

      if (isSuccess) {
        updateBrowserActionIcon (0);
        callbackDone(true, backupListItem, fullBackup);
      }
      else {
        updateBrowserActionIcon (1);
        callbackDone(false);
      }
    }

    saveBackups (backupListItemArray, fullBackupArray, callbackDoneWrapper);
    */
  });







}











backupNow(true, "id", null);



console.log('init ended');
