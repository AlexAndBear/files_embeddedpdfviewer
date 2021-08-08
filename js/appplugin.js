/**
 * @author Jan Ackermann
 * @copyright 2021 Jan Ackermann jackermann@owncloud.com
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the LICENSE file.
 */

(function (OCA) {

	OCA.FilesEmbeddedPdfViewer = OCA.FilesEmbeddedPdfViewer || {};

	/**
	 * @namespace OCA.FilesPdfViewer.AppPlugin
	 */
	OCA.FilesEmbeddedPdfViewer.AppPlugin = {

		/**
		 * @param fileList
		 */
		attach: function (fileList) {
			this.extendFileActions(fileList.fileActions);
		},

		/**
		 * @param fileActions
		 * @private
		 */
		extendFileActions: function (fileActions) {
			var self = this;
			fileActions.registerAction({
				name: 'FilesEmbeddedPdfViewer',
				displayName: t('files_embeddedpdfviewer', 'View PDF'),
				mime: 'application/pdf',
				iconClass: 'icon-toggle',
				permissions: OC.PERMISSION_READ,
				actionHandler: function (fileName, context) {
					self.show(fileName, context.dir, context.fileList);
				}
			});
			fileActions.setDefault('application/pdf', 'FilesEmbeddedPdfViewer');
		},

		/**
		 * @param fileName
		 * @param dir
		 */
		show: function(fileName, dir){
			var that = this;
			var oReq = new XMLHttpRequest();
			oReq.open("GET", Files.getDownloadUrl(fileName, dir), true);
			oReq.responseType = "arraybuffer";

			oReq.onload = function() {
				var file = new Blob([this.response], {
					type: 'application/pdf'
				});
				that.onFileLoaded(file);
			};
			oReq.send();
		},

		/**
		 * @param file
		 */
		onFileLoaded: function (file){
			var fileURL = URL.createObjectURL(file);

			FileList.setViewerMode(true);
			var template = $('<object data="'+fileURL+'" type="application/pdf" width="100%" height="100%"></object>');
			$('#app-content #controls').addClass('hidden');
			$('#app-content').append(template);

			var closeButton = $('<button class="close-pdf-button">' + t('files_embeddedpdfviewer', 'Close PDF') + '</button>').appendTo("#header");

			closeButton.on('click', function (){
				location.reload();
			});

			$(document).keyup(function(e) {
				if (e.key === "Escape") {
					location.reload();
				}
			});
		},

	};

})(OCA);

OC.Plugins.register('OCA.Files.FileList', OCA.FilesEmbeddedPdfViewer.AppPlugin);
