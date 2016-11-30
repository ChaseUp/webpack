const PI = 3.14;
class MyReact{
	constructor(name){
		this.name = name;
	}
	speak(){
		console.log(this.name);
	}
}

module.exports = {
	PI: PI,
	MyReact: MyReact
}