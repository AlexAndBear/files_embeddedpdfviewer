<?php
/**
 * @author Jan Ackermann
 * @copyright 2021 Jan Ackermann jackermann@owncloud.com
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later.
 * See the LICENSE file.
 */

namespace OCA\Files_EmbeddedPdfViewer\AppInfo;

use OC\Files\View;
use OCA\Files_EmbeddedPdfViewer\Controller\DisplayController;
use OCP\AppFramework\App;
use OCP\AppFramework\IAppContainer;

class Application extends App {

	/**
	 * @param array $urlParams
	 */
	public function __construct(array $urlParams = []) {
		parent::__construct('files_embeddedpdfviewer', $urlParams);

		$container = $this->getContainer();
		$server = $container->getServer();

		$container->registerService('DisplayController', function (IAppContainer $c) use ($server) {
			$user = $server->getUserSession()->getUser();
			if ($user) {
				$uid = $user->getUID();
			} else {
				throw new \BadMethodCallException('no user logged in');
			}
			/** @phan-suppress-next-line PhanUndeclaredClassMethod */
			return new DisplayController(
				$c->getAppName(),
				$server->getRequest(),
				new View('/' . $uid . '/files'),
			);
		});
	}
}
