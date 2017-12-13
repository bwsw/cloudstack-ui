<a name="1.410.16"></a>
## [1.410.16](https://github.com/bwsw/cloudstack-ui/compare/1.410.15...1.410.16) (2017-12-12)


### Bug Fixes

* **account-actions:** Remove action box in the card of account user ([#726](https://github.com/bwsw/cloudstack-ui/issues/726)) ([542df61](https://github.com/bwsw/cloudstack-ui/commit/542df61))
* **firewall:** Account filter added to Firewall section ([#750](https://github.com/bwsw/cloudstack-ui/issues/750)) ([6a6977d](https://github.com/bwsw/cloudstack-ui/commit/6a6977d))
* **core:**  fix compilation warnings ([#713](https://github.com/bwsw/cloudstack-ui/issues/713)) ([667088d](https://github.com/bwsw/cloudstack-ui/commit/667088d))
* **core:** ngx-clipboard version updated ([#723](https://github.com/bwsw/cloudstack-ui/issues/723)) ([c75827c](https://github.com/bwsw/cloudstack-ui/commit/c75827c))
* **service-offering:** Service offering selection fix ([3dc97a6](https://github.com/bwsw/cloudstack-ui/commit/3dc97a6))
* **firewall:** Remove delete button for system firewall templates ([#754](https://github.com/bwsw/cloudstack-ui/issues/754)) ([ca45c7b](https://github.com/bwsw/cloudstack-ui/commit/ca45c7b))
* **firewall:** Fix filter by account ([1588f2d](https://github.com/bwsw/cloudstack-ui/commit/1588f2d))
* **snapshots:** Fix snapshot modal window bugs ([#755](https://github.com/bwsw/cloudstack-ui/issues/755)) ([50d6394](https://github.com/bwsw/cloudstack-ui/commit/50d6394))
* **snapshot:** Fix time set conditions ([8e12f7b](https://github.com/bwsw/cloudstack-ui/commit/8e12f7b))
* **vm:** Template/ISO switcher in VM creation wrong behaviour ([#737](https://github.com/bwsw/cloudstack-ui/issues/737)) ([12a8274](https://github.com/bwsw/cloudstack-ui/commit/12a8274))
* **template:** Template creation fixed (closes [#705](https://github.com/bwsw/cloudstack-ui/issues/705)) ([#710](https://github.com/bwsw/cloudstack-ui/issues/710)) ([ad481f2](https://github.com/bwsw/cloudstack-ui/commit/ad481f2))
* **template:** "Group by" wrong behaviour when changing group tag of a template ([#725](https://github.com/bwsw/cloudstack-ui/issues/725)) ([d62c04f](https://github.com/bwsw/cloudstack-ui/commit/d62c04f))
* **vm-creation:** change the condition to show firewall rule selector (closes [#746](https://github.com/bwsw/cloudstack-ui/issues/746)) ([#749](https://github.com/bwsw/cloudstack-ui/issues/749)) ([9a07942](https://github.com/bwsw/cloudstack-ui/commit/9a07942))
* **vm-volume-attachment:** filter volumes and vms by entity account ([#729](https://github.com/bwsw/cloudstack-ui/issues/729)) ([eefc8f2](https://github.com/bwsw/cloudstack-ui/commit/eefc8f2))


### Features

* **core:** Angular and Material updated ([#753](https://github.com/bwsw/cloudstack-ui/issues/753)) ([8172076](https://github.com/bwsw/cloudstack-ui/commit/8172076))
* **firewall:** add filter by account for security group page ([abe52d0](https://github.com/bwsw/cloudstack-ui/commit/abe52d0))



<a name="1.410.15"></a>
## [1.410.15](https://github.com/bwsw/cloudstack-ui/compare/1.49.14...1.410.15) (2017-12-01)


### Bug Fixes

* **account-creation:** Both name and email are highlighted when creating an Account ([#686](https://github.com/bwsw/cloudstack-ui/issues/686)) ([720f8f9](https://github.com/bwsw/cloudstack-ui/commit/720f8f9))
* **lists:** Selected item on listing pages is more visible now ([#677](https://github.com/bwsw/cloudstack-ui/issues/677)) ([610a7b1](https://github.com/bwsw/cloudstack-ui/commit/610a7b1))
* **ngrx:** NGRX library updated not to show warning for angular5 ([#695](https://github.com/bwsw/cloudstack-ui/issues/695)) ([900b8f1](https://github.com/bwsw/cloudstack-ui/commit/900b8f1))
* **sidebar-actions:** Sidebar does not close if an entity(account/vol… ([#709](https://github.com/bwsw/cloudstack-ui/issues/709)) ([fc273ee](https://github.com/bwsw/cloudstack-ui/commit/fc273ee))
* **vm-creation:** Check iso size before vm creation ([#706](https://github.com/bwsw/cloudstack-ui/issues/706)) ([2d73591](https://github.com/bwsw/cloudstack-ui/commit/2d73591))


### Features

* **ngrx-auth:** Clear NGRX Store if user logs out ([#685](https://github.com/bwsw/cloudstack-ui/issues/685)) ([9d2ce34](https://github.com/bwsw/cloudstack-ui/commit/9d2ce34))
* **sg:** Use ngrx for firewall security groups (closes [#632](https://github.com/bwsw/cloudstack-ui/issues/632)) ([#658](https://github.com/bwsw/cloudstack-ui/issues/658)) ([a1f3f71](https://github.com/bwsw/cloudstack-ui/commit/a1f3f71))
* **sg-sidebar:** add sidebar details for security groups ([#672](https://github.com/bwsw/cloudstack-ui/issues/672)) ([4b05a20](https://github.com/bwsw/cloudstack-ui/commit/4b05a20))
* **vm:** Virtual Machine list and sidebar now use NGRX store ([#678](https://github.com/bwsw/cloudstack-ui/issues/678)) ([dec1a10](https://github.com/bwsw/cloudstack-ui/commit/dec1a10))
* **vm-creation-agreement:** Template/ISO Terms and Conditions Agreement ([#659](https://github.com/bwsw/cloudstack-ui/issues/659)) ([bf039fc](https://github.com/bwsw/cloudstack-ui/commit/bf039fc))



<a name="1.49.14"></a>
## [1.49.14](https://github.com/bwsw/cloudstack-ui/compare/1.49.13...1.49.14) (2017-11-16)


### Bug Fixes

* **ssh-keys-sidebar:** SSH keys sidebar loads invalid key if multiple keys with the same names are listed ([#653](https://github.com/bwsw/cloudstack-ui/issues/653)) ([7227296](https://github.com/bwsw/cloudstack-ui/commit/7227296))
* **storage-filer:** Fix account filter for storage ([#663](https://github.com/bwsw/cloudstack-ui/issues/663)) ([91ff650](https://github.com/bwsw/cloudstack-ui/commit/91ff650))
* **vm-volume:** Missing space in the VM volume info russian translation  ([ef48233](https://github.com/bwsw/cloudstack-ui/commit/ef48233))


### Features

* **core:** Angular update to version 5.0.0 ([b73d983](https://github.com/bwsw/cloudstack-ui/commit/b73d983))
* **list-box-view:** add list/box view switch ([#639](https://github.com/bwsw/cloudstack-ui/issues/639)) ([dcc4e97](https://github.com/bwsw/cloudstack-ui/commit/dcc4e97))
* **storage-ngrx:** use ngrx for storage ([#655](https://github.com/bwsw/cloudstack-ui/issues/655)) ([447d835](https://github.com/bwsw/cloudstack-ui/commit/447d835))
* **vm-creation:** Improve shared SGs - Support assigning of many groups to a VM ([#641](https://github.com/bwsw/cloudstack-ui/issues/641)) ([a139904](https://github.com/bwsw/cloudstack-ui/commit/a139904))



<a name="1.49.13"></a>
## [1.49.13](https://github.com/bwsw/cloudstack-ui/compare/1.49.12...1.49.13) (2017-11-01)


### Bug Fixes

* **mat-spinner:** Spinner has a wrong size ([#642](https://github.com/bwsw/cloudstack-ui/issues/642)) ([f528bdb](https://github.com/bwsw/cloudstack-ui/commit/f528bdb))
* **sg-rules:** System Firewall templates view mode bug ([#634](https://github.com/bwsw/cloudstack-ui/issues/634)) ([f1b34fc](https://github.com/bwsw/cloudstack-ui/commit/f1b34fc))
* **vm-creation:** Check Template size before VM Creation ([#620](https://github.com/bwsw/cloudstack-ui/issues/620)) ([54e28a6](https://github.com/bwsw/cloudstack-ui/commit/54e28a6))
* **vm-creation:** Error in VM creation when affinity group contains c… ([#633](https://github.com/bwsw/cloudstack-ui/issues/633)) ([47280ac](https://github.com/bwsw/cloudstack-ui/commit/47280ac))
* **vm-dialogs:** "Access VM" and "Save password for all VMs" dialogs have incorrect header ([#626](https://github.com/bwsw/cloudstack-ui/issues/626)) ([6fb53c7](https://github.com/bwsw/cloudstack-ui/commit/6fb53c7))
* **vm-list:** "Cannot read property 'tokens' of undefined" in production ([#640](https://github.com/bwsw/cloudstack-ui/issues/640)) ([9602998](https://github.com/bwsw/cloudstack-ui/commit/9602998))


### Features

* **activity log:** add account filter to activity log page  ([#610](https://github.com/bwsw/cloudstack-ui/issues/610)) ([10cb8ba](https://github.com/bwsw/cloudstack-ui/commit/10cb8ba))
* **core:** Angular and Material2 versions updated ([3851b8e](https://github.com/bwsw/cloudstack-ui/commit/3851b8e))



<a name="1.49.12"></a>
## [1.49.12](https://github.com/bwsw/cloudstack-ui/compare/1.49.11...1.49.12) (2017-10-18)


### Bug Fixes

* **auth:** Login error handling fixed ([40db70b](https://github.com/bwsw/cloudstack-ui/commit/40db70b))
* **recurring-snapshots:** reorder components and update styles for Recurring Snapshots dialog ([#565](https://github.com/bwsw/cloudstack-ui/issues/565)) ([954b470](https://github.com/bwsw/cloudstack-ui/commit/954b470))
* **volume-attachment:** Volume/VM Attachment dialog allows to attach Disk and VM from different accounts ([#602](https://github.com/bwsw/cloudstack-ui/issues/602)) ([932fe5d](https://github.com/bwsw/cloudstack-ui/commit/932fe5d))


### Features

* **vm:** Added "Access VM" action that opens modal window ([#604](https://github.com/bwsw/cloudstack-ui/issues/604)) ([099359e](https://github.com/bwsw/cloudstack-ui/commit/099359e))
* **manage-accounts:** Accounts management page added ([#594](https://github.com/bwsw/cloudstack-ui/issues/594)) ([844f98d](https://github.com/bwsw/cloudstack-ui/commit/844f98d))
* **save-vm-password:** Save VM password functionality added ([#603](https://github.com/bwsw/cloudstack-ui/issues/603)) ([f019cba](https://github.com/bwsw/cloudstack-ui/commit/f019cba))
* **vm:** Move VM color picker from details card to the VM name line ([#583](https://github.com/bwsw/cloudstack-ui/issues/583)) ([5ce7aaa](https://github.com/bwsw/cloudstack-ui/commit/5ce7aaa))



<a name="1.49.11"></a>
## [1.49.11](https://github.com/bwsw/cloudstack-ui/compare/1.49.10...1.49.11) (2017-10-04)


### Bug Fixes

* **security-group:** add new translation for sg-groups ([5b2a75d](https://github.com/bwsw/cloudstack-ui/commit/5b2a75d))
* **pulse:** Manual Chart Refresh fix ([c1f338b](https://github.com/bwsw/cloudstack-ui/commit/c1f338b))
* **security-group:** Missing translations added to SG creation modal (closes [#553](https://github.com/bwsw/cloudstack-ui/issues/553)) ([#559](https://github.com/bwsw/cloudstack-ui/issues/559)) ([25c4c9a](https://github.com/bwsw/cloudstack-ui/commit/25c4c9a))
* **sidebar:** Ignore saved config for sidebar reordering if allowReorderingSidebar is disabled ([#558](https://github.com/bwsw/cloudstack-ui/issues/558)) ([9e74045](https://github.com/bwsw/cloudstack-ui/commit/9e74045))
* **translate:** Fixed missing translation on Login Screen ([#570](https://github.com/bwsw/cloudstack-ui/issues/570)) ([a9ed887](https://github.com/bwsw/cloudstack-ui/commit/a9ed887))


### Features

* **core:** Added support for listCapabilities API call (closes [#521](https://github.com/bwsw/cloudstack-ui/issues/521)) ([af1e936](https://github.com/bwsw/cloudstack-ui/commit/af1e936))
* **listAll:** add listAll and account filter ([#535](https://github.com/bwsw/cloudstack-ui/issues/535)) ([f950015](https://github.com/bwsw/cloudstack-ui/commit/f950015))
* **optional:** add template optional fields ([be36d1b](https://github.com/bwsw/cloudstack-ui/commit/be36d1b))
* **security-group:** Rename "security group template" to "security group" in source code ([#584](https://github.com/bwsw/cloudstack-ui/issues/584)) ([db3ba7e](https://github.com/bwsw/cloudstack-ui/commit/db3ba7e))
* **sg-rules:** Improve object name display in forms ([#586](https://github.com/bwsw/cloudstack-ui/issues/586)) ([c1de286](https://github.com/bwsw/cloudstack-ui/commit/c1de286))
* **vm-creation:** VM creation log and post-deployment actions ([14db677](https://github.com/bwsw/cloudstack-ui/commit/14db677))
* **vm-sidebar:** Fix text in "Attach a volume" bar in VM management sidebar ([#579](https://github.com/bwsw/cloudstack-ui/issues/579)) ([3c2144f](https://github.com/bwsw/cloudstack-ui/commit/3c2144f))



<a name="1.49.10"></a>
## [1.49.10](https://github.com/bwsw/cloudstack-ui/compare/1.49.9...1.49.10) (2017-09-21)


### Bug Fixes

* **logout:** Fix Fix broken logout redirection ([ccb3401](https://github.com/bwsw/cloudstack-ui/commit/ccb3401)), closes [#525](https://github.com/bwsw/cloudstack-ui/issues/525)
* **nic:** fix extra param being passed to addIpToNic ([b07b9c3](https://github.com/bwsw/cloudstack-ui/commit/b07b9c3))
* **pulse:** increase pulse dialog width ([#518](https://github.com/bwsw/cloudstack-ui/issues/518)) ([772845f](https://github.com/bwsw/cloudstack-ui/commit/772845f)), closes [#487](https://github.com/bwsw/cloudstack-ui/issues/487)
* **sidebar:** Sidebar scrolling fixed. (closes [#532](https://github.com/bwsw/cloudstack-ui/issues/532)) ([b92225d](https://github.com/bwsw/cloudstack-ui/commit/b92225d))
* **snapshot:** Recurring snapshots modal dialog fix. (Closes [#550](https://github.com/bwsw/cloudstack-ui/issues/550)) ([#551](https://github.com/bwsw/cloudstack-ui/issues/551)) ([db1edf8](https://github.com/bwsw/cloudstack-ui/commit/db1edf8))
* **styles:** fix template creation dialog styles ([19a4195](https://github.com/bwsw/cloudstack-ui/commit/19a4195))
* **styles:** Fix template OS icon ([bd22ed8](https://github.com/bwsw/cloudstack-ui/commit/bd22ed8)), closes [#529](https://github.com/bwsw/cloudstack-ui/issues/529)
* **styles:** Fix volume sidebar tabs being not evenly spaced ([4abab60](https://github.com/bwsw/cloudstack-ui/commit/4abab60)), closes [#536](https://github.com/bwsw/cloudstack-ui/issues/536)
* **vm:** Missing WebShell action added back ([5bb4252](https://github.com/bwsw/cloudstack-ui/commit/5bb4252))
* **vm-creation:** remove default instance group in VM creation ([9f7a716](https://github.com/bwsw/cloudstack-ui/commit/9f7a716))


### Features

* **config:** add sessionTimeout option to config ([#519](https://github.com/bwsw/cloudstack-ui/issues/519)) ([357b4ff](https://github.com/bwsw/cloudstack-ui/commit/357b4ff)), closes [#500](https://github.com/bwsw/cloudstack-ui/issues/500)
* **firewall:** Firewall Ingress/Egress rules display changed ([e32dc4a](https://github.com/bwsw/cloudstack-ui/commit/e32dc4a))
* **nic-details:** Split NICs into separate cards ([c37202f](https://github.com/bwsw/cloudstack-ui/commit/c37202f)), closes [#455](https://github.com/bwsw/cloudstack-ui/issues/455)
* **shared-security-groups:** Add support for shared security groups  ([8b4869d](https://github.com/bwsw/cloudstack-ui/commit/8b4869d)), closes [#326](https://github.com/bwsw/cloudstack-ui/issues/326)
* **snapshots:** delete snapshots if volume is deleted ([#515](https://github.com/bwsw/cloudstack-ui/issues/515)) ([759ea35](https://github.com/bwsw/cloudstack-ui/commit/759ea35))
* **ssh-keys:** Add description for SSH keys ([4c2b1ac](https://github.com/bwsw/cloudstack-ui/commit/4c2b1ac)), closes [#235](https://github.com/bwsw/cloudstack-ui/issues/235)
* **tags:** Add filtering to system tags ([bd23e1e](https://github.com/bwsw/cloudstack-ui/commit/bd23e1e)), closes [#261](https://github.com/bwsw/cloudstack-ui/issues/261)
* **vm-creation:** show 'no templates available' when there is no templates or iso in the vm creation ([#524](https://github.com/bwsw/cloudstack-ui/issues/524)) ([4a54277](https://github.com/bwsw/cloudstack-ui/commit/4a54277)), closes [#522](https://github.com/bwsw/cloudstack-ui/issues/522)
* **volume:** Check if volume is ready before taking snapshot ([#546](https://github.com/bwsw/cloudstack-ui/issues/546)) ([9d245fe](https://github.com/bwsw/cloudstack-ui/commit/9d245fe))
* **volumes:** Add filtering, grouping by volume type. Highlight ROOT volumes  ([d6672ae](https://github.com/bwsw/cloudstack-ui/commit/d6672ae)), closes [#485](https://github.com/bwsw/cloudstack-ui/issues/485)



<a name="1.49.9"></a>
## [1.49.9](https://github.com/bwsw/cloudstack-ui/compare/1.49.8...1.49.9) (2017-09-05)


### Bug Fixes

* **tags:** add condition for add button (#469) ([c4e0086](https://github.com/bwsw/cloudstack-ui/commit/c4e0086))
* **date-picker:** Fix date picker cancel button ([45caa0e](https://github.com/bwsw/cloudstack-ui/commit/45caa0e)), closes [#474](https://github.com/bwsw/cloudstack-ui/issues/474)
* **dialog-layout:** add styles for modal dialog ([75ed1b0](https://github.com/bwsw/cloudstack-ui/commit/75ed1b0))
* **filters:** Fix spare drive filters ([8c28546](https://github.com/bwsw/cloudstack-ui/commit/8c28546)), closes [#488](https://github.com/bwsw/cloudstack-ui/issues/488)
* **modals:** Check if 'create' is in URL before showing suggestion dialog ([1e4ec47](https://github.com/bwsw/cloudstack-ui/commit/1e4ec47)), closes [#454](https://github.com/bwsw/cloudstack-ui/issues/454)
* **routes:** fix redirection links for creation modals (#451) ([98f2f63](https://github.com/bwsw/cloudstack-ui/commit/98f2f63)), closes [#451](https://github.com/bwsw/cloudstack-ui/issues/451)
* **security-groups:** Subscribe to security group updates ([6a17119](https://github.com/bwsw/cloudstack-ui/commit/6a17119)), closes [#472](https://github.com/bwsw/cloudstack-ui/issues/472)
* **service-offering:** service offering not being restored after cancel was clicked (closes #479) ([7efce4d](https://github.com/bwsw/cloudstack-ui/commit/7efce4d)), closes [#479](https://github.com/bwsw/cloudstack-ui/issues/479) [#479](https://github.com/bwsw/cloudstack-ui/issues/479)
* **snapshot:** Fix null returned in snapshot creation ([4b860c1](https://github.com/bwsw/cloudstack-ui/commit/4b860c1))
* **vm-list:** unknown OS type icon size (closes #481) ([90a6815](https://github.com/bwsw/cloudstack-ui/commit/90a6815)), closes [#481](https://github.com/bwsw/cloudstack-ui/issues/481) [#481](https://github.com/bwsw/cloudstack-ui/issues/481)
* **spare-drives:** Add missing actions to spare drives ([b1eb1cf](https://github.com/bwsw/cloudstack-ui/commit/b1eb1cf))
* **ssh-key-creation:** remove extra params from constructor ([db3f511](https://github.com/bwsw/cloudstack-ui/commit/db3f511))
* **storage:** Groupings localStorage/url saving fixed ([33a25bb](https://github.com/bwsw/cloudstack-ui/commit/33a25bb))
* **translations:** fix incorrect translation token ([7ea872b](https://github.com/bwsw/cloudstack-ui/commit/7ea872b))
* **translations:** Fix incorrect translations ([1aa83f5](https://github.com/bwsw/cloudstack-ui/commit/1aa83f5)), closes [#459](https://github.com/bwsw/cloudstack-ui/issues/459)
* **vm-creation:** bind context (#463) ([1d8ccf5](https://github.com/bwsw/cloudstack-ui/commit/1d8ccf5))


### Features

* **dialogs:** replace mdl with md-dialogs (#422) ([24c1d74](https://github.com/bwsw/cloudstack-ui/commit/24c1d74))
* **Docker:** Multi-stage build added ([3e14b5e](https://github.com/bwsw/cloudstack-ui/commit/3e14b5e))
* **pulse:** make dots on charts appear only on hover (#425) ([e606ed2](https://github.com/bwsw/cloudstack-ui/commit/e606ed2)), closes [#425](https://github.com/bwsw/cloudstack-ui/issues/425)
* **routes:** add routes for creation dialogs (closes #411) ([66ea3c2](https://github.com/bwsw/cloudstack-ui/commit/66ea3c2)), closes [#411](https://github.com/bwsw/cloudstack-ui/issues/411)
* **sidebar:** reorder sidebar links (closes #36) ([c516c3e](https://github.com/bwsw/cloudstack-ui/commit/c516c3e)), closes [#36](https://github.com/bwsw/cloudstack-ui/issues/36) [#36](https://github.com/bwsw/cloudstack-ui/issues/36)
* **sidebar:** Show 'Entity not found' message if id in query params is invalid ([324eed6](https://github.com/bwsw/cloudstack-ui/commit/324eed6)), closes [#374](https://github.com/bwsw/cloudstack-ui/issues/374)
* **spare-drives:** Rename "Spare drives" to "Storage", add search, filtering and snapshot view to "Storage" section ([c750752](https://github.com/bwsw/cloudstack-ui/commit/c750752)), closes [#416](https://github.com/bwsw/cloudstack-ui/issues/416)
* **statistics:** allow admins to view domain statistics (closes #426) ([84795ca](https://github.com/bwsw/cloudstack-ui/commit/84795ca)), closes [#426](https://github.com/bwsw/cloudstack-ui/issues/426) [#426](https://github.com/bwsw/cloudstack-ui/issues/426)



<a name="1.49.8"></a>
## [1.49.8](https://github.com/bwsw/cloudstack-ui/compare/1.0.7...1.49.8) (2017-08-23)


### Bug Fixes

* **deps:** fix chartjs version ([ea28725](https://github.com/bwsw/cloudstack-ui/commit/ea28725))
* **docker:** Fixed docker run ([baac261](https://github.com/bwsw/cloudstack-ui/commit/baac261))
* **service offering:** fix service offering dialog bug (#441) ([1ab7a51](https://github.com/bwsw/cloudstack-ui/commit/1ab7a51)), closes [#441](https://github.com/bwsw/cloudstack-ui/issues/441)
* **sshkeys:** fix layout of ssh-keys cards (#438) ([7f6815a](https://github.com/bwsw/cloudstack-ui/commit/7f6815a)), closes [#438](https://github.com/bwsw/cloudstack-ui/issues/438)
* **sshkeys:** fix SG page popover bug (#440) ([38b471f](https://github.com/bwsw/cloudstack-ui/commit/38b471f)), closes [#440](https://github.com/bwsw/cloudstack-ui/issues/440)
* **tab-switch:** fix tab index (#437) ([a59c9f6](https://github.com/bwsw/cloudstack-ui/commit/a59c9f6)), closes [#437](https://github.com/bwsw/cloudstack-ui/issues/437)
* **translations:** fix incorrect translations ([bed72dd](https://github.com/bwsw/cloudstack-ui/commit/bed72dd))
* **translations:** fix incorrect translations ([74f1004](https://github.com/bwsw/cloudstack-ui/commit/74f1004))
* **translations:** Fix wrong translation tokens  ([07cfcc3](https://github.com/bwsw/cloudstack-ui/commit/07cfcc3)), closes [#423](https://github.com/bwsw/cloudstack-ui/issues/423)
* **translations:** update translation token ([986de5e](https://github.com/bwsw/cloudstack-ui/commit/986de5e))
* **vm-list:** Tooltips in cards overlap (#392) ([5eca059](https://github.com/bwsw/cloudstack-ui/commit/5eca059))


### Features

* **pulse:** store parameters for pulse ([0bfe8a0](https://github.com/bwsw/cloudstack-ui/commit/0bfe8a0))
* **security group:** Add "Select all" and "Reset" buttons to security group component ([89f8ddd](https://github.com/bwsw/cloudstack-ui/commit/89f8ddd))
* **tabs:** replace mdl-tabs with md-tabs (#390) ([fa113bf](https://github.com/bwsw/cloudstack-ui/commit/fa113bf))



<a name="1.0.7"></a>
## [1.0.7](https://github.com/bwsw/cloudstack-ui/compare/1.0.6...1.0.7) (2017-08-14)


### Bug Fixes

* **dialogs:** Check if there are any groups and hide the assign option if there aren't ([32e1f90](https://github.com/bwsw/cloudstack-ui/commit/32e1f90)), closes [#358](https://github.com/bwsw/cloudstack-ui/issues/358)
* **encoding:** Remove extra URL encoding from base backend service ([c329d75](https://github.com/bwsw/cloudstack-ui/commit/c329d75)), closes [#354](https://github.com/bwsw/cloudstack-ui/issues/354)
* **icons:** Replace text with icons in template sidebar ([e4a54d8](https://github.com/bwsw/cloudstack-ui/commit/e4a54d8)), closes [#344](https://github.com/bwsw/cloudstack-ui/issues/344)
* **login:** add proper redirect from next=login query param ([3f67c43](https://github.com/bwsw/cloudstack-ui/commit/3f67c43)), closes [#376](https://github.com/bwsw/cloudstack-ui/issues/376)
* **resize disk:** remove unused request ([fbc699e](https://github.com/bwsw/cloudstack-ui/commit/fbc699e))
* **resource bar:** Handle infinite available resources ([3adc4f0](https://github.com/bwsw/cloudstack-ui/commit/3adc4f0)), closes [#356](https://github.com/bwsw/cloudstack-ui/issues/356)
* **service offering:** Add service offering params to service offering init function ([454e1a7](https://github.com/bwsw/cloudstack-ui/commit/454e1a7)), closes [#355](https://github.com/bwsw/cloudstack-ui/issues/355)
* **service offering change:** Add safe navigation to ServiceOfferingService.getList ([8f2c93b](https://github.com/bwsw/cloudstack-ui/commit/8f2c93b)), closes [#357](https://github.com/bwsw/cloudstack-ui/issues/357)
* **ssh:** add "No SSH keys" message ([97896c8](https://github.com/bwsw/cloudstack-ui/commit/97896c8)), closes [#341](https://github.com/bwsw/cloudstack-ui/issues/341)
* **tags:** Tag naming ([96d0e9c](https://github.com/bwsw/cloudstack-ui/commit/96d0e9c)), closes [#337](https://github.com/bwsw/cloudstack-ui/issues/337)
* **template:** add condition for template handleClick ([ba18f2c](https://github.com/bwsw/cloudstack-ui/commit/ba18f2c))
* **template:** fix iso attachment lists ([7b1bd91](https://github.com/bwsw/cloudstack-ui/commit/7b1bd91))
* **template:** reload the template list bug ([1af2376](https://github.com/bwsw/cloudstack-ui/commit/1af2376))
* **template:** Template List sidebar now looks better if a page is narrow. ([bafe3c4](https://github.com/bwsw/cloudstack-ui/commit/bafe3c4)), closes [#362](https://github.com/bwsw/cloudstack-ui/issues/362)
* **time formatting:** Add time formatting to all time strings ([11b4b62](https://github.com/bwsw/cloudstack-ui/commit/11b4b62)), closes [#323](https://github.com/bwsw/cloudstack-ui/issues/323)
* **vm:** fix bug in VM description field ([d2f8a11](https://github.com/bwsw/cloudstack-ui/commit/d2f8a11))
* **vm:** fix error in vm list loading ([c284717](https://github.com/bwsw/cloudstack-ui/commit/c284717))
* **vm:** fix redirect to login page error ([2237bc0](https://github.com/bwsw/cloudstack-ui/commit/2237bc0))
* **VM list:** Save VM filters ([e9004e3](https://github.com/bwsw/cloudstack-ui/commit/e9004e3)), closes [#350](https://github.com/bwsw/cloudstack-ui/issues/350)
* **volume attachment:** Fix volume and template attachments ([2de29fd](https://github.com/bwsw/cloudstack-ui/commit/2de29fd)), closes [#360](https://github.com/bwsw/cloudstack-ui/issues/360)
* **volume resize:** Fix broken API in volume resize ([400cbef](https://github.com/bwsw/cloudstack-ui/commit/400cbef)), closes [#359](https://github.com/bwsw/cloudstack-ui/issues/359)
* **webshell:** Webshell config changed ([cef34b7](https://github.com/bwsw/cloudstack-ui/commit/cef34b7))


### Features

* **card:** replace mdl-card with md-card ([8956318](https://github.com/bwsw/cloudstack-ui/commit/8956318))
* **list:** replace lists by MD component ([13fc0b5](https://github.com/bwsw/cloudstack-ui/commit/13fc0b5))
* **notification:** replace mdl-snackbar by md-snackbar ([658f25a](https://github.com/bwsw/cloudstack-ui/commit/658f25a))
* **pulse:** Pulse plugin ([b14155e](https://github.com/bwsw/cloudstack-ui/commit/b14155e)), closes [#290](https://github.com/bwsw/cloudstack-ui/issues/290)
* **service offering:** default service offering ([6238d1e](https://github.com/bwsw/cloudstack-ui/commit/6238d1e)), closes [#201](https://github.com/bwsw/cloudstack-ui/issues/201)
* **snapshots:** recurring snapshots ([f01514f](https://github.com/bwsw/cloudstack-ui/commit/f01514f)), closes [#49](https://github.com/bwsw/cloudstack-ui/issues/49)
* **storage:** Use session storage instead of local storage for activity log page (#251) ([16e6d99](https://github.com/bwsw/cloudstack-ui/commit/16e6d99))
* **template:** replace "update" text label to icon at Images -> Zones Tab for image (#263) ([af16442](https://github.com/bwsw/cloudstack-ui/commit/af16442))
* **template:** replace template srl URL by icon ([03c5fe3](https://github.com/bwsw/cloudstack-ui/commit/03c5fe3))
* **webshell:** WebShell ([3df7d49](https://github.com/bwsw/cloudstack-ui/commit/3df7d49)), closes [#289](https://github.com/bwsw/cloudstack-ui/issues/289)



<a name="1.0.6"></a>
## 1.0.6 (2017-07-25)

Features, Enhancements

|#ticket|What was done|
|---|---|
|[#226](https://github.com/bwsw/cloudstack-ui/issues/226)|Network tab is implemented in VM details sidebar|
|[#12](https://github.com/bwsw/cloudstack-ui/issues/12)|Time format choice is added to settings|
|[#216](https://github.com/bwsw/cloudstack-ui/issues/216)|Tags tab for VM and templates (Images) is implemented|
|[#11](https://github.com/bwsw/cloudstack-ui/issues/11)|Resource usage bar is upgraded (free & used resources)|
|[#9](https://github.com/bwsw/cloudstack-ui/issues/9)|Grouping VM by colors is upgraded|
|[#242](https://github.com/bwsw/cloudstack-ui/issues/242)|"No SSH key" option is added to SSH key selector in VM creation dialog|
|[#109](https://github.com/bwsw/cloudstack-ui/issues/109)|"No group" filtering is added for VM groups|
|[#28](https://github.com/bwsw/cloudstack-ui/issues/28)|VM creation is refactored|
|[#199](https://github.com/bwsw/cloudstack-ui/issues/199)|Elements grouping component is implemented|
|[#267](https://github.com/bwsw/cloudstack-ui/issues/267)|Migration to Angular Material (mdl-select => md-select)|
|[#268](https://github.com/bwsw/cloudstack-ui/issues/268)|Migration to Angular Material (mdl-tooltip => mdTooltip)|
|[#206](https://github.com/bwsw/cloudstack-ui/issues/206)|CONTRIBUTING.md guidelines document is created|

Bugs fixed

|#ticket|What was done|
|---|---|
|[#233](https://github.com/bwsw/cloudstack-ui/issues/233)|Affinity group change: "VM stop" message bug is fixed|

---

<a name="1.0.5"></a>
## 1.0.5 (2017-07-12)

Features, Enhancements

|#ticket|What was done|
|---|---|
|[#246](https://github.com/bwsw/cloudstack-ui/issues/246)|Warning message appears in case of VM start fail|
|[#230](https://github.com/bwsw/cloudstack-ui/issues/230)|Reload icon for VM statistics pane in a sidebar is implemented|
|[#224](https://github.com/bwsw/cloudstack-ui/issues/224)|VM Group change dialog is upgraded|
|[#225](https://github.com/bwsw/cloudstack-ui/issues/225)|Affinity Group change dialog is upgraded|
|[#197](https://github.com/bwsw/cloudstack-ui/issues/197)|A contrast circle around state bullet is added|
|[#116](https://github.com/bwsw/cloudstack-ui/issues/116)|SSH keys (re)setting in VM detailed sidebar is implemented|
|[#20](https://github.com/bwsw/cloudstack-ui/issues/20)|Parameters are configurable in json config|

Bugs fixed

|#ticket|What was done|
|---|---|
|[#254](https://github.com/bwsw/cloudstack-ui/issues/254)|Empty event list problem is fixed|
|[#232](https://github.com/bwsw/cloudstack-ui/issues/232)|Incorrect Activity Log Date bug is fixed|
|[#231](https://github.com/bwsw/cloudstack-ui/issues/231)|A tooltip is added for Regenerate keys action icon in Settings|
|[#228](https://github.com/bwsw/cloudstack-ui/issues/228)|Configured logout timeout bug is fixed|
|[#223](https://github.com/bwsw/cloudstack-ui/issues/223)|VM color picker bug is fixed|

---

<a name="1.0.4"></a>
## 1.0.4 (2017-06-27)



