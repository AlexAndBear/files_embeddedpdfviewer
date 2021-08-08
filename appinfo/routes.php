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

$app = new Application();

$app->registerRoutes($this, ['routes' => [
	['name' => 'display#showPdfViewer', 'url' => '/load', 'verb' => 'GET'],
]]);
