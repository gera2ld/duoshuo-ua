QUnit.test('User agent: Opera', function (assert) {
	var res = UAParser.parse('Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.89 Safari/537.36 OPR/28.0.1750.48');
	assert.ok(UAParser.getString(res.os) == 'Windows 8.1', 'OS passed.');
  assert.ok(UAParser.getString(res.browser) == 'Opera 28.0.1750.48', 'Browser passed.');
});
