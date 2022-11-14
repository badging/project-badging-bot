const scanner = async(id, name, octokit, payload) => {

  const {data} = await octokit.rest.repos.getContent({
    owner: payload.repository.owner.login,
    repo: payload.repository.name
  });

  const DEI_file_data = data.filter(file => file.name.includes('DEI'))?console.log('Yes'):console.log('No')

  DEI_file_data?console.log('Yes'):console.log('No')
}

module.exports = scanner;