QUnit.test('User agent: Opera', function (assert) {
	var res = UAParser.parse('Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36 OPR/28.0.1750.48');
	assert.ok(UAParser.getString(res.os) == 'Windows 8.1', 'OS passed.');
  assert.ok(UAParser.getString(res.browser) == 'Opera 28.0.1750.48', 'Browser passed.');
});

QUnit.test('User agent: Ubuntu Firefox', function(assert) {
	var res = UAParser.parse('Mozilla/5.0 (X11; Ubuntu; Linux i686; rv:38.0) Gecko/20100101 Firefox/38.0');
	assert.ok(UAParser.getString(res.os) == 'Ubuntu', 'OS passed.');
	assert.ok(UAParser.getString(res.browser) == 'Firefox 38.0', 'Browser passed.');
});

QUnit.test('User agent: Maxthon', function(assert) {
	var res = UAParser.parse('Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Maxthon/4.4.5.3000 Chrome/30.0.1599.101 Safari/537.36');
	assert.ok(UAParser.getString(res.browser) == 'Maxthon 4.4.5.3000', 'Browser passed.');
});
