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
					self.renderPdfViewer(fileName, context.dir, context.fileList);
				}
			});
			fileActions.setDefault('application/pdf', 'FilesEmbeddedPdfViewer');
		},

		/**
		 * @param fileName
		 * @param dir
		 */
		renderPdfViewer: function(fileName, dir){
				var self = this;
				$.get(
				OC.generateUrl('/apps/files_embeddedpdfviewer/load'),
				{
					fileName: fileName,
					dir: dir
				}
			).done(function(template) {
				self.onTemplateLoaded(template);
			});
		},

		/**
		 * @param template

		 */
		onTemplateLoaded: function (template){
			FileList.setViewerMode(true);
			$('#app-content #controls').addClass('hidden');
			$('#app-content').append($(template));

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
