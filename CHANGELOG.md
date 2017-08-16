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



