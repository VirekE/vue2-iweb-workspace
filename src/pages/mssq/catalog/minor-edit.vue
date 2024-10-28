<!--<style lang="less" src="@_src/pages/mssq/common/css/form.less" scoped></style>-->
<template>
	<div class="cardView">
		<div>
			<page-header :subTitle="subTitle">
			</page-header>
			<template v-if="$route.query.id">
				<div class="view" ref="getHeight">
					<el-tabs v-model="activeName" @tab-click="changeTabs">
						<el-tab-pane label="目录信息" name="info">
							<div class="info">
								<img :src="titleSrc" class="imgClass" alt="" />
								<span>基本信息</span>
							</div>
              <el-form ref="form" :model="cataLogInfo" :rules="rules" label-width="180px">
                <div class="fromBox">
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="一级索引码" prop="primaryIndex" class="select">
                        <template slot="label">
                          <span>一级索引码</span>
                          <el-tooltip class="item" effect="dark" content="" placement="top-start">
                            <template slot="content">
                              指对应民生诉求事项职责清单中的索引一级码。
                            </template>
                            <i class="el-icon-warning-outline"></i>
                          </el-tooltip>
                        </template>
                        <el-select v-model="cataLogInfo.primaryIndex" filterable @change="setName"
                                   :filter-method="searchPrimaryIndex" :disabled="!proEdit"
                                   placeholder="请输入一级索引码" :class="!proEdit?'inputDisabled':''">
                          <el-option v-for="item in newPrimaryIndexList" :label="item.code"
                                     :value="item.code" :key="item.id">
                            <span style="float: left">{{ item.code }}</span>
                            <span>({{ item.name }})</span>
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="一级索引名称" prop="primaryIndexName" class="select">
                        <template slot="label">
                          <span>一级索引名称</span>
                          <el-tooltip class="item" effect="dark" content="" placement="top-start">
                            <template slot="content">
                              指对应民生诉求事项职责清单中的一级索引名称。
                            </template>
                            <i class="el-icon-warning-outline"></i>
                          </el-tooltip>
                        </template>
                        <el-select v-model="cataLogInfo.primaryIndexName" filterable placeholder="请输入一级索引名称"
                                   :class="!proEdit?'inputDisabled':''"  @change="setName" :disabled="!proEdit"
                                   :filter-method="searchPrimaryIndex">
                          <el-option v-for="item in newPrimaryIndexList" :label="item.code" :key="item.code"
                                     :value="item.code">
                            <span style="float: left">({{ item.name }})</span>
                          </el-option>
                        </el-select>
                        <!--<el-popover
                                ref="popover"
                                placement="bottom"
                                width="200"
                                trigger="focus">&lt;!&ndash;focus&ndash;&gt;
                          <div class="cellAll">
                            <template v-for="(item,index) in newPrimaryIndexList">
                              <div class="focusCell" @click="setName(item.code)">
                                <span style="float: left">{{ item.code }}</span>
                                <span>({{ item.name }})</span>
                              </div>
                            </template>
                          </div>
                        </el-popover>
                        <el-autocomplete v-model="cataLogInfo.primaryIndexName" @input="searchPrimaryIndexName" v-popover:popover></el-autocomplete>-->
                        <!--<el-autocomplete
                                :class="!canEdit?'inputDisabled':''" :readonly="!canEdit"
                                v-model="cataLogInfo.primaryIndexName"
                                :fetch-suggestions="searchPrimaryIndex"
                                placeholder="请输入内容"
                                @select="setName"
                                v-popover:popover>
                          <template slot-scope="{ item }">
                            <div class="select-content">
                              <div class="addr">{{ item.name }}</div>
      &lt;!&ndash;												<span class="name">{{ item. code}}</span>&ndash;&gt;
                            </div>
                          </template>
                        </el-autocomplete>-->
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="二级索引码" prop="parentCode" class="select">
                        <template slot="label">
                          <span>二级索引码</span>
                          <el-tooltip class="item" effect="dark" content="" placement="top-start">
                            <template slot="content">
                              指对应民生诉求事项职责清单中的索引二级码。
                            </template>
                            <i class="el-icon-warning-outline"></i>
                          </el-tooltip>
                        </template>
                        <div>
                          <el-select v-model="cataLogInfo.parentCode" @change="setParentName" placeholder="请输入二级索引码"
                                     :class="!proEdit?'inputDisabled':''" :disabled="!proEdit" filterable  :filter-method="searchParentCode">
                            <el-option v-for="item in newParentIndexList" :label="item.code" :key="item.code"
                                       :value="item.code">
                              <span style="float: left">{{ item.code }}</span>
                              <span>({{ item.name }})</span>
                            </el-option>
                          </el-select>
                          <!--<p :class="$route.query.type == 'edit'?'':'catalogCodeDisabled'" class="code">
                            {{cataLogInfo.primaryIndex}}</p>
                          <el-autocomplete
                                  :class="!canEdit?'inputDisabled':''" :readonly="!canEdit"
                                  v-model="cataLogInfo.parentCode"
                                  :fetch-suggestions="searchParentCode"
                                  placeholder="请输入内容"
                                  @select="setParentName"
                                  v-popover:popover>
                            <template slot-scope="{ item }">
                              <div class="select-content">
                                <div class="name">{{ item. code}}</div>
                                <span class="addr">{{ item.name }}</span>
                              </div>
                            </template>
                          </el-autocomplete>-->
                        </div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="二级索引名称" prop="parentName" class="select">
                        <template slot="label">
                          <span>二级索引名称</span>
                          <el-tooltip class="item" effect="dark" content="" placement="top-start">
                            <template slot="content">
                              指对应民生诉求事项职责清单中的二级索引名称。
                            </template>
                            <i class="el-icon-warning-outline"></i>
                          </el-tooltip>
                        </template>
                        <el-select v-model="cataLogInfo.parentName" @change="setParentName" placeholder="请输入二级索引名称"
                                   :class="!proEdit?'inputDisabled':''" filterable  :filter-method="searchParentCode" :disabled="!proEdit">
                          <el-option v-for="item in newParentIndexList" :label="item.code" :key="item.code"
                                     :value="item.code">
                            <span style="float: left">{{ item.name }}</span>
                          </el-option>
                        </el-select>
                        <!--	<el-popover
                                  ref="popover"
                                  placement="bottom"
                                  width="200"
                                  trigger="focus">&lt;!&ndash;focus&ndash;&gt;
                            <div class="cellAll">
                              <template v-for="(item,index) in newParentIndexList">
                                <div class="focusCell" @click="setParentName(item.code)">
                                  <span style="float: left">{{ item.code }}</span>
                                  <span>({{ item.name }})</span>
                                </div>
                              </template>
                            </div>
                          </el-popover>-->
                        <!--<el-autocomplete
                                :class="!canEdit?'inputDisabled':''" :readonly="!canEdit"
                                v-model="cataLogInfo.parentName"
                                :fetch-suggestions="searchParentCode"
                                placeholder="请输入内容"
                                @select="setParentName"
                                v-popover:popover>
                          <template slot-scope="{ item }">
                            <div class="select-content">
                              <div class="name">{{ item.name }}</div>
      &lt;!&ndash;												<span class="addr">{{ item. code}}</span>&ndash;&gt;
                            </div>
                          </template>
                        </el-autocomplete>-->
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="三级索引码" class="select">
                        <template slot="label">
                          <span>三级索引码</span>
                          <el-tooltip class="item" effect="dark" content="" placement="top-start">
                            <template slot="content">
                              指对应民生诉求事项职责清单中的三级索引码。
                            </template>
                            <i class="el-icon-warning-outline"></i>
                          </el-tooltip>
                        </template>
                        <el-input class="inputDisabled" :readonly="!canEdit" disabled
                                  maxlength="3" v-model="cataLogInfo.catalogCode" placeholder="请输入三级索引码">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="三级分类（事件描述）" prop="catalogName" class="select">
                        <template slot="label">
                          <span>三级分类（事件描述）</span>
                          <el-tooltip class="item" effect="dark" content="" placement="top-start">
                            <template slot="content">
                              政务服务诉求事项的具体名称，依据法律法规、部门规章等规范性文件进行梳理。名称中不能加入实施机关或实施主体的名称、地名和数字。国家省市县四级不同级别或同级别间相同事项名称应保持一致
                            </template>
                            <i class="el-icon-warning-outline"></i>
                          </el-tooltip>
                        </template>
                        <el-input :class="!canEdit?'inputDisabled':''" :readonly="!canEdit"
                                  v-model="cataLogInfo.catalogName" placeholder="请输入三级分类（事件描述）"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="事项层级" prop="level" class="select">
                        <template slot="label">
                          <span>事项层级</span>
                          <el-tooltip class="item" effect="dark" content="" placement="top-start">
                            <template slot="content">
                              指事项实施和处置部门的级别，包括市级、区级、街道级、社区级。
                            </template>
                            <i class="el-icon-warning-outline"></i>
                          </el-tooltip>
                        </template>
                        <el-select :class="!canEdit?'selectChange':''" :disabled="!canEdit"
                                   v-model="cataLogInfo.level" placeholder="请选择事项层级">
                          <el-option :index="index" v-for="(item,index) in dictionary.SSCJ" :key="index"
                                     :value="item.itemCode" :label="item.itemValue"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
<!--                    <el-col :span="12">
                      <el-form-item label="所属平台" prop="owningPlatform" class="select">
                        <el-select :class="!canEdit?'selectChange':''" :disabled="!canEdit"
                                   v-model="cataLogInfo.owningPlatform" placeholder="请选择所属平台">
                          <el-option :index="index" v-for="(item,index) in owningList" :key="index"
                                     :value="item.itemCode" :label="item.itemValue"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>-->
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="事项来源" prop="itemSource" class="select">
                        <el-input :class="!canEdit?'inputDisabled':''" v-model="cataLogInfo.itemSource"
                                  :readonly="!canEdit" placeholder="请选择事项来源"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item label="设立依据" prop="catalogLaw" class="select">
                        <template slot="label">
                          <span>设立依据</span>
                          <el-tooltip class="item" effect="dark" content="" placement="top-start">
                            <template slot="content">
                              指民生诉求事项依据的国家法律法规、地方性法律法规、权责清单、部门规章等文件。
                            </template>
                            <i class="el-icon-warning-outline"></i>
                          </el-tooltip>
                        </template>
                        <el-input :class="!canEdit?'inputDisabled':''" type="textarea" :rows="3"
                                  v-model="cataLogInfo.catalogLaw" :readonly="!canEdit"
                                  placeholder="事项的国家法律法规、地方性法律法规、职责清单、部门规章等，按照国家、省、市的顺序填写。如果事项来源于法律法规，需要填写法律法规名称、依据文号、条款号、条款内容、颁布机构；来源于各级政府文件，需要填写文件名称和文号。">
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form>
							<div v-if="$route.query.pageType == 'catalogList'" class="catalogInfoTable">
								<div class="info">
									<img :src="titleSrc" class="imgClass" alt="" />
									<span>【{{cataLogInfo.catalogName}}】的职责清单</span>
								</div>
								<el-table :data="tableData">
									<el-table-column type="index" label="序号" width="50"></el-table-column>
									<el-table-column prop="itemCode" label="事项编码" show-overflow-tooltip></el-table-column>
									<!--事项编码取用目录编码字段-->
									<el-table-column prop="itemName" label="事项名称" show-overflow-tooltip>
										<template slot-scope="scope">
											<div class="jump-title" @click="onEditItem(scope.row.itemVid,'view')">
												{{scope.row.itemName}}
											</div>
										</template>
									</el-table-column>
									<el-table-column prop="selfDeptName" label="职责部门名称" show-overflow-tooltip></el-table-column>
									<el-table-column prop="level" label="事项层级" :formatter="formatterPriority" show-overflow-tooltip
																	 width="100px" align="center"></el-table-column>
									<el-table-column prop="manageType" label="管理类型" :formatter="formatterManage"
																	 show-overflow-tooltip width="100px" align="center">
										<template slot-scope="scope">
											<el-tag type="success" v-if="scope.row.manageType">{{formatterManage(scope.row)}}
											</el-tag>
											<span v-else></span>
										</template>
									</el-table-column>
								</el-table>
								<div class="block">
									<el-pagination @current-change="handleCurrentChange" :current-page.sync="params.page"
																 :page-size="params.limit" layout="total,prev, pager, next, jumper"
																 :total="params.total">
									</el-pagination>
								</div>
							</div>
						</el-tab-pane>
						<el-tab-pane label="流转过程" name="circulation" v-if="$route.query.id">
							<circulation-process :cataLogInfo="cataLogInfo" :parentHeight="parentHeight" @childHeight="childHeight">
							</circulation-process>
						</el-tab-pane>
						<el-tab-pane label="历史版本" name="history" v-if="$route.query.id">
							<history-version :cataLogInfo="cataLogInfo" v-if="activeName == 'history'" :parentHeight="parentHeight"
								@childHeight="childHeight"></history-version>
						</el-tab-pane>
					</el-tabs>
				</div>
			</template>
			<template v-else>
				<el-form ref="form" :model="cataLogInfo" :rules="rules" label-width="180px">
					<div class="fromBox">
						<el-row>
							<el-col :span="12">
								<el-form-item label="一级索引码" prop="primaryIndex" class="select">
									<template slot="label">
										<span>一级索引码</span>
										<el-tooltip class="item" effect="dark" content="" placement="top-start">
											<template slot="content">
												指对应民生诉求事项职责清单中的索引一级码。
											</template>
											<i class="el-icon-warning-outline"></i>
										</el-tooltip>
									</template>
									<el-select v-model="cataLogInfo.primaryIndex" filterable @change="setName"
														 :filter-method="searchPrimaryIndex" :disabled="!proEdit"
                    placeholder="请输入一级索引码" :class="!proEdit?'inputDisabled':''">
                    <el-option v-for="item in newPrimaryIndexList" :label="item.code"
                      :value="item.code" :key="item.id">
                      <span style="float: left">{{ item.code }}</span>
                      <span>({{ item.name }})</span>
                    </el-option>
                  </el-select>
									<!--	<el-popover
                            ref="popover"
                            placement="bottom"
                            width="200"
                            trigger="click">&lt;!&ndash;focus&ndash;&gt;
                      <div class="cellAll">
                        <template v-for="(item,index) in newPrimaryIndexList">
                          <div class="focusCell" @click="setName(item.code)">
                            <span style="float: left">{{ item.code }}</span>
                            <span>({{ item.name }})</span>
                          </div>
                        </template>
                      </div>
                    </el-popover>-->
								<!--	<el-autocomplete
													:class="!canEdit?'inputDisabled':''" :readonly="!canEdit"
													v-model="cataLogInfo.primaryIndex"
													:fetch-suggestions="searchPrimaryIndex"
													placeholder="请输入内容"
													@select="setName"
													v-popover:popover>
										<template slot-scope="{ item }">
											<div class="select-content">
												<div class="name">{{ item.code }}</div>
												<span class="addr">{{ item.name }}</span>
											</div>
										</template>
									</el-autocomplete>-->
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="一级索引名称" prop="primaryIndexName" class="select">
									<template slot="label">
										<span>一级索引名称</span>
										<el-tooltip class="item" effect="dark" content="" placement="top-start">
											<template slot="content">
												指对应民生诉求事项职责清单中的一级索引名称。
											</template>
											<i class="el-icon-warning-outline"></i>
										</el-tooltip>
									</template>
									<el-select v-model="cataLogInfo.primaryIndexName" filterable placeholder="请输入一级索引名称"
                    :class="!proEdit?'inputDisabled':''"  @change="setName" :disabled="!proEdit"
														 :filter-method="searchPrimaryIndex">
                    <el-option v-for="item in newPrimaryIndexList" :label="item.code" :key="item.code"
                      :value="item.code">
											<span style="float: left">({{ item.name }})</span>
										</el-option>
                  </el-select>
									<!--<el-popover
                          ref="popover"
                          placement="bottom"
                          width="200"
                          trigger="focus">&lt;!&ndash;focus&ndash;&gt;
                    <div class="cellAll">
                      <template v-for="(item,index) in newPrimaryIndexList">
                        <div class="focusCell" @click="setName(item.code)">
                          <span style="float: left">{{ item.code }}</span>
                          <span>({{ item.name }})</span>
                        </div>
                      </template>
                    </div>
                  </el-popover>
                  <el-autocomplete v-model="cataLogInfo.primaryIndexName" @input="searchPrimaryIndexName" v-popover:popover></el-autocomplete>-->
									<!--<el-autocomplete
													:class="!canEdit?'inputDisabled':''" :readonly="!canEdit"
													v-model="cataLogInfo.primaryIndexName"
													:fetch-suggestions="searchPrimaryIndex"
													placeholder="请输入内容"
													@select="setName"
													v-popover:popover>
										<template slot-scope="{ item }">
											<div class="select-content">
												<div class="addr">{{ item.name }}</div>
&lt;!&ndash;												<span class="name">{{ item. code}}</span>&ndash;&gt;
											</div>
										</template>
									</el-autocomplete>-->
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="二级索引码" prop="parentCode" class="select">
									<template slot="label">
										<span>二级索引码</span>
										<el-tooltip class="item" effect="dark" content="" placement="top-start">
											<template slot="content">
												指对应民生诉求事项职责清单中的索引二级码。
											</template>
											<i class="el-icon-warning-outline"></i>
										</el-tooltip>
									</template>
									<div>
										<el-select v-model="cataLogInfo.parentCode" @change="setParentName" placeholder="请输入二级索引码"
															 :class="!proEdit?'inputDisabled':''" :disabled="!proEdit" filterable  :filter-method="searchParentCode">
											<el-option v-for="item in newParentIndexList" :label="item.code" :key="item.code"
																 :value="item.code">
												<span style="float: left">{{ item.code }}</span>
												<span>({{ item.name }})</span>
											</el-option>
										</el-select>
										<!--<p :class="$route.query.type == 'edit'?'':'catalogCodeDisabled'" class="code">
											{{cataLogInfo.primaryIndex}}</p>
										<el-autocomplete
														:class="!canEdit?'inputDisabled':''" :readonly="!canEdit"
														v-model="cataLogInfo.parentCode"
														:fetch-suggestions="searchParentCode"
														placeholder="请输入内容"
														@select="setParentName"
														v-popover:popover>
											<template slot-scope="{ item }">
												<div class="select-content">
													<div class="name">{{ item. code}}</div>
													<span class="addr">{{ item.name }}</span>
												</div>
											</template>
										</el-autocomplete>-->
									</div>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="二级索引名称" prop="parentName" class="select">
									<template slot="label">
										<span>二级索引名称</span>
										<el-tooltip class="item" effect="dark" content="" placement="top-start">
											<template slot="content">
												指对应民生诉求事项职责清单中的二级索引名称。
											</template>
											<i class="el-icon-warning-outline"></i>
										</el-tooltip>
									</template>
									<el-select v-model="cataLogInfo.parentName" @change="setParentName" placeholder="请输入二级索引名称"
														 :class="!proEdit?'inputDisabled':''" filterable  :filter-method="searchParentCode" :disabled="!proEdit">
										<el-option v-for="item in newParentIndexList" :label="item.code" :key="item.code"
															 :value="item.code">
											<span style="float: left">{{ item.name }}</span>
										</el-option>
									</el-select>
									<!--	<el-popover
                            ref="popover"
                            placement="bottom"
                            width="200"
                            trigger="focus">&lt;!&ndash;focus&ndash;&gt;
                      <div class="cellAll">
                        <template v-for="(item,index) in newParentIndexList">
                          <div class="focusCell" @click="setParentName(item.code)">
                            <span style="float: left">{{ item.code }}</span>
                            <span>({{ item.name }})</span>
                          </div>
                        </template>
                      </div>
                    </el-popover>-->
									<!--<el-autocomplete
													:class="!canEdit?'inputDisabled':''" :readonly="!canEdit"
													v-model="cataLogInfo.parentName"
													:fetch-suggestions="searchParentCode"
													placeholder="请输入内容"
													@select="setParentName"
													v-popover:popover>
										<template slot-scope="{ item }">
											<div class="select-content">
												<div class="name">{{ item.name }}</div>
&lt;!&ndash;												<span class="addr">{{ item. code}}</span>&ndash;&gt;
											</div>
										</template>
									</el-autocomplete>-->
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="三级索引码" class="select">
									<template slot="label">
										<span>三级索引码</span>
										<el-tooltip class="item" effect="dark" content="" placement="top-start">
											<template slot="content">
												指对应民生诉求事项职责清单中的三级索引码。
											</template>
											<i class="el-icon-warning-outline"></i>
										</el-tooltip>
									</template>
										<el-input class="inputDisabled" :readonly="!canEdit" disabled
															maxlength="3" v-model="cataLogInfo.catalogCode" placeholder="请输入三级索引码">
										</el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="三级分类（事件描述）" prop="catalogName" class="select">
									<template slot="label">
										<span>三级分类（事件描述）</span>
										<el-tooltip class="item" effect="dark" content="" placement="top-start">
											<template slot="content">
												政务服务诉求事项的具体名称，依据法律法规、部门规章等规范性文件进行梳理。名称中不能加入实施机关或实施主体的名称、地名和数字。国家省市县四级不同级别或同级别间相同事项名称应保持一致
											</template>
											<i class="el-icon-warning-outline"></i>
										</el-tooltip>
									</template>
									<el-input :class="!canEdit?'inputDisabled':''" :readonly="!canEdit"
														v-model="cataLogInfo.catalogName" placeholder="请输入三级分类（事件描述）"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="事项层级" prop="level" class="select">
                  <template slot="label">
                    <span>事项层级</span>
                    <el-tooltip class="item" effect="dark" content="" placement="top-start">
                      <template slot="content">
                        指事项实施和处置部门的级别，包括市级、区级、街道级、社区级。
                      </template>
                      <i class="el-icon-warning-outline"></i>
                    </el-tooltip>
                  </template>
                  <el-select :class="!canEdit?'selectChange':''" :disabled="!canEdit"
                             v-model="cataLogInfo.level" placeholder="请选择事项层级">
                    <el-option :index="index" v-for="(item,index) in dictionary.SSCJ" :key="index"
                               :value="item.itemCode" :label="item.itemValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
<!--              <el-col :span="12">
                <el-form-item label="所属平台" prop="owningPlatform" class="select">
                  <el-select :class="!canEdit?'selectChange':''" :disabled="!canEdit"
                             v-model="cataLogInfo.owningPlatform" placeholder="请选择所属平台">
                    <el-option :index="index" v-for="(item,index) in dictionary.OWNING_PLATFORM" :key="index"
                               :value="item.itemCode" :label="item.itemValue"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>-->
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="事项来源" prop="itemSource" class="select">
                  <el-input :class="!canEdit?'inputDisabled':''" v-model="cataLogInfo.itemSource"
                            :readonly="!canEdit" placeholder="请选择事项来源"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
						<el-row>
							<el-col :span="24">
								<el-form-item label="设立依据" prop="catalogLaw" class="select">
									<template slot="label">
										<span>设立依据</span>
										<el-tooltip class="item" effect="dark" content="" placement="top-start">
											<template slot="content">
												指民生诉求事项依据的国家法律法规、地方性法律法规、权责清单、部门规章等文件。
											</template>
											<i class="el-icon-warning-outline"></i>
										</el-tooltip>
									</template>
									<el-input :class="!canEdit?'inputDisabled':''" type="textarea" :rows="3"
														v-model="cataLogInfo.catalogLaw" :readonly="!canEdit"
														placeholder="事项的国家法律法规、地方性法律法规、职责清单、部门规章等，按照国家、省、市的顺序填写。如果事项来源于法律法规，需要填写法律法规名称、依据文号、条款号、条款内容、颁布机构；来源于各级政府文件，需要填写文件名称和文号。">
									</el-input>
								</el-form-item>
							</el-col>
						</el-row>
					</div>
				</el-form>
			</template>
			<div class="footer" style="text-align:center">
				<template v-for="(item, index) in optData">
					<el-popover v-if="item.name == '保存'" placement="top-start" title="说明" width="240" trigger="hover">
						<p> 1、点击“保存”，保存成功，则提示“保存成功”。</p>
						<p> 2、点击“保存”，保存失败，则提示“保存失败”。</p>
						<template slot="reference">
							<el-button :key="index" :icon="'iconfont '+item.icon" :type="item.type"
								@click="optClick(item.method)">
								{{item.name}}
							</el-button>
						</template>
					</el-popover>
					<el-button :loading="loading" :key="index" v-else :icon="'iconfont '+item.icon" :type="item.type"
						@click="optClick(item.method)">
						{{item.name}}
					</el-button>
				</template>
			</div>
			<el-dialog title="部门选择" width="50%" :close-on-click-modal=false class="qz-dialog-padding qz-law"
				:visible.sync="guidanceInfo">
				<BusinessCode @results="guidance = $event"></BusinessCode>
				<span slot="footer" class="dialog-footer">
					<el-button @click="guidanceInfo= false">取 消</el-button>
					<el-button type="primary" @click="getGuidance">确 定</el-button>
				</span>
			</el-dialog>
		</div>
	</div>
</template>
<script>
  import qzBase from '@_src/pages/mssq/common/util/qzBase';
  import PageHeader from '@_src/pages/mssq/common/components/page-header';
  import BusinessCode from './business-code';
  import OptObj from './optJs/opt-data.js'
  import CirculationProcess from "./circulationProcess";
  import HistoryVersion from "./history-version";
  import option from '../common/components/option/index.js'

  export default {
		mixins: [qzBase],
		components: {
			HistoryVersion,
			CirculationProcess,
			PageHeader,
			BusinessCode
		},
		data() {
			let checkCatalogCode = (rule, value, callback) => {
				let rtx = /^[0-9]+$/;
				if ((value + this.cataLogInfo.parentCode + this.cataLogInfo.primaryIndex).length !== 8) {
					callback(new Error('三级索引码为一级索引码+二级索引码 + 3位字符组成的八位数'))
				} else if (!rtx.test(value)) {
					callback(new Error('输入的类型不正确，请输入2位纯数字'))
				} else {
					let url = this.Config.baseContext + '/mssq/mssqCatalog/verifyCatalogCode';
					this.$http_post(url, {
						catalogCode: this.cataLogInfo.parentCode + value,
						catalogId: this.cataLogInfo.catalogId || '',
					}).then(ret => {
						if (ret) {
							if (ret.state == 0) {
								callback(new Error(ret.message));
								return;
							}
							callback();
						} else {
							callback(new Error('三级索引码重复'))
						}
					});
				}
			};
			let checkCatalogName = (rule, value, callback) => {
				let url = this.Config.baseContext + '/mssq/mssqCatalog/verifyCatalogName';
				this.$http_post(url, {
					catalogName: value,
					catalogId: this.cataLogInfo.catalogId || '',
				}).then(ret => {
					if (ret) {
						if (ret.state == 0) {
							callback(new Error(ret.message));
							return;
						}

						callback();
					} else {
						callback(new Error('三级索引名称重复'))
					}
				});
			};
			let checkParentCode = (rule, value, callback) => {
				let rtx = /^[0-9]+$/
				if (value === '') {
					callback(new Error('请输入任意三位'));
				} else if (!rtx.test(value)) {
					callback(new Error('输入的类型不正确，请输入3位纯数字'))
				} else {
					let url = this.Config.baseContext + '/mssq/mssqCatalog/verifyParentCode';
					if (value && this.cataLogInfo.parentName && !this.firstInto) {
						this.$http_post(url, {
							parentCode: value,
							parentName: this.cataLogInfo.parentName,
						}).then(ret => {
							if (ret) {
								if (ret.state == 0) {
									callback(new Error(ret.message));
									return;
								}
								callback();
							} else {
								callback(new Error('二级索引名称和编码对应不上'))
							}
						});
					}
				}
			};
			let checkParentName = (rule, value, callback) => {
				let url = this.Config.baseContext + '/mssq/mssqCatalog/verifyParentCode';
				if (value && this.cataLogInfo.parentCode && !this.firstInto) {
					this.$http_post(url, {
						parentName: value,
						parentCode: this.cataLogInfo.parentCode,
					}).then(ret => {
						if (ret) {
							if (ret.state == 0) {
								callback(new Error(ret.message));
								return;
							}

							callback();
						} else {
							callback(new Error('二级索引名称和编码对应不上'))
						}
					});
				} else {

				}
			};
			let checkPrimaryIndex = (rule, value, callback) => {
				let rtx = /^[0-9]+$/;
				if (value.length !== 2) {
					callback(new Error('一级索引码为两位字符组成'))
				} else if (!rtx.test(value)) {
					callback(new Error('输入的类型不正确，请输入2位纯数字'))
				} else {
					let url = this.Config.baseContext + '/mssq/mssqCatalog/verifyPrimaryIndexCode';
					if (value && this.cataLogInfo.primaryIndexName && !this.firstInto) {
						this.$http_post(url, {
							primaryIndex: value,
							primaryIndexName: this.cataLogInfo.primaryIndexName,
						}).then(ret => {
							if (ret) {
								if (ret.state == 0) {
									callback(new Error(ret.message));
									return;
								}

								callback();
							} else {
								callback(new Error('一级索引名称和编码对应不上'))
							}
						});
					}
				}
			};
			let checkPrimaryIndexName = (rule, value, callback) => {
				let url = this.Config.baseContext + '/mssq/mssqCatalog/verifyPrimaryIndexCode';
				if (value && this.cataLogInfo.primaryIndex && !this.firstInto) {
					this.$http_post(url, {
						primaryIndexName: value,
						primaryIndex: this.cataLogInfo.primaryIndex,
					}).then(ret => {
						if (ret) {
							if (ret.state == 0) {
								callback(new Error(ret.message));
								return;
							}

							callback();
						} else {
							callback(new Error('一级索引名称和编码对应不上'))
						}
					});
				}
			};
			return {
				timeout:0,
        owningList:[{
          itemCode:'1',
          itemValue:'民生诉求'
        },{
          itemCode:'2',
          itemValue:'深平安'
        }],
				restaurants:[],
				parrentResta:[],
				loading: false,
				parentHeight: 0,
				primaryIndexList: [],
				parentIndexList: [],
				newParentIndexList: [],
				activeName: 'info',
				uploadUrl: '',
				guidance: [],
				guidanceInfo: false,
				canEdit: false, //是否可編輯
				proEdit: true, //是否可編輯
				dictionary: {},
				id: '',
				parentId: '123',
				saveInfos: {},
				cataLogInfo: {
					parentName: '',
					parentCode: '',
					primaryIndexName: '',
					primaryIndex: '',
					id: '', //主键id
					catalogName: '', //目录名称
					catalogCode: '', //目录编码
					version: '', //目录版本
					status: '', //状态
				},
				tableData:[],//职责清单列表
				params:{
					page:1,
					limit:10,
					total:0
				},
				rules: {
					catalogName: [{
							required: true,
							message: '请填写三级索引名称',
							trigger: 'blur'
						},
						{
							required: true,
							validator: checkCatalogName,
							trigger: 'blur'
						},
					],
          owningPlatform: [{
							required: true,
							message: '请选择所属平台',
							trigger: 'change'
						}
					],
					catalogCode: [{
							required: true,
							message: '请填写三级索引码',
							trigger: 'blur'
						},
						{
							validator: checkCatalogCode,
							trigger: 'blur'
						},
					],
					primaryIndexName: [{
							required: true,
							message: '请填写一级索引名称',
							trigger: ['blur','change']
						},
						{
							required: true,
							validator: checkPrimaryIndexName,
							trigger:['blur','change']
						},
					],
					primaryIndex: [{
							required: true,
							message: '请填写一级索引码',
							trigger: ['blur','change']
						},
						{
							required: true,
							validator: checkPrimaryIndex,
							trigger: ['blur','change']
						},
						{
							min: 2,
							max: 2,
							message: '一级索引码长度必须为2位数',
							trigger: 'blur'
						}
					],
					parentName: [{
							required: true,
							message: '请填写二级索引名称',
							trigger: ['blur','change']
						},
						{
							required: true,
							validator: checkParentName,
							trigger:['blur','change']
						},
					],
					parentCode: [{
						required: true,
						validator: checkParentCode,
						trigger: ['blur','change']
					}, ],
					itemSource: [{
						required: true,
						message: '请输入事项来源',
						trigger: 'blur'
					}],
					level: [{
						required: true,
						message: '请选择事项层级',
						trigger: 'change'
					}],
				},
				optData: [],
				newPrimaryIndexList: [],
        firstInto:true,
			}
		},
		computed: {
			subTitle() {
				let obj = {
					distribution: '事项分拨详情',
					view: '目录清单详情',
					edit: '目录变更详情',
					add: '新增申请详情',
					issue: '事项下发详情',
					history: '目录版本详情',
					examine: '目录审核详情',
					todo: '详情',
				};
				return obj[this.$route.query.pageType]
			},
			titleSrc(){
				return require('../components/img/zs.svg')
			},
		},
		watch: {
			$route: {
				handler(val) {
					this.onQuery();
					this.getTableList();
					// this.firstInto = false;
				},
				deep: true,
				immediate: true
			},
		},
		methods: {
			initOptMethod(methodType) {
				var that = this;
				that.optData = OptObj[methodType].optData;

				// 加载方法
				Promise.all([import('./optJs/' + methodType)]).then(([result]) => {
					const obj = result.default;
					that.optMethod = obj;
				}).catch((error) => {})
			},
			optClick(method) {
        this.optMethod[method](this); //获取按钮
			},
			//文件上传
			handleRemove(file, fileList) {},
			handlePreview(file) {
				//下载
				var url = this.Config.rcPath + "/disk/" + file.rcId
				window.open(url);
			},
			onError(file) {
				this.$message.error("文件上传失败!" + file.message);
			},
			handleExceed(files, fileList) {
				this.$message.warning('当前限制选择 3 个文件,共选择了 ' + fileList.length + ' 个文件');
			},
			uploadSuccess(file) {
				//this.cataLogInfo.fileObj.push(file.row);
				var fileObj = this.cataLogInfo.fileObj;
				if (file.state == 1) {
					var tempFile = {};
					tempFile.name = file.row.fileName;
					tempFile.rcId = file.row.rcId;

					fileObj.push(tempFile);
					this.cataLogInfo.fileObj = fileObj;
				} else {
					fileObj = this.cataLogInfo.fileObj;
					fileObj.splice(fileObj.length - 1, 1);
					this.cataLogInfo.fileObj = fileObj;
					this.$message.error("文件上传失败!");
				}

			},
			uploadError() {
				this.$message.error("文件上传失败!");
			},
			beforeRemove(file) {
				var _that = this;
				return this.$confirm('确定移除 ' + file.name + '?', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					showCancelButton: true
				}).then(() => {
					console.log(_that)
				});
			},
			forSubmit(callback) {
				let _this = this;
				this.$refs.form.validate((valid) => {

					if (valid) {
						_this.saveInfos = JSON.parse(JSON.stringify(_this.cataLogInfo));
						// _this.saveInfos.catalogCode = _this.saveInfos.primaryIndex + _this.saveInfos.parentCode + _this.saveInfos.catalogCode;
						// _this.saveInfos.parentCode = _this.saveInfos.primaryIndex + _this.saveInfos.parentCode;
						callback(true);
					}
				});
			},
			forSave(callback) {
				var cataLogInfo = this.cataLogInfo;
				cataLogInfo = Object.assign({}, cataLogInfo);
				//只校验部分
				if (cataLogInfo.catalogName == "" || cataLogInfo.catalogCode == "" || cataLogInfo.parentName == "" ||
					cataLogInfo.parentCode == "" || cataLogInfo.primaryIndex == "" || cataLogInfo.primaryIndexName == "") {
					this.$message.error("索引码和索引名称都不能为空!");
				} else {
					this.saveInfos = cataLogInfo;
					// this.saveInfos.catalogCode =this.saveInfos.primaryIndex + this.saveInfos.parentCode + this.saveInfos.catalogCode;
					// this.saveInfos.parentCode = this.saveInfos.primaryIndex + this.saveInfos.parentCode;
					callback(true, 'minor');
				}
			},
			setDictionary(val) {
				var dictionary = {};
				dictionary.SSCJ = val.SSCJ;
				dictionary.busiType = val['BUSI_TYPE'];
				dictionary.manageType = val.MANAGE_TYPE;
				dictionary.SUB_TASK_TYPE = val.SUB_TASK_TYPE;
				dictionary.OWNING_PLATFORM = val.OWNING_PLATFORM;
				this.dictionary = dictionary;
			},
			remove(type, index) {
				if (type == "setUp") {
					this.$confirm('确定删除此项设立依据吗?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.cataLogInfo.cataLogQzqdList.splice(index, 1);
					}).catch((e) => {
						console.log(e)
					});
				}
				if (type == "implement") {
					this.$confirm('确定删除此项实施依据吗?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.ssyjTable.splice(index, 1);
					}).catch((e) => {
						console.log(e)
					});
				}
			},
			getGuidance() {
				var ret = this.guidance;
				this.cataLogInfo.businessCode = ret[0].itemCode;
				this.guidanceInfo = false;
			},

			onQuery() {
				const id = this.$route.query.id;
				if (this.isNotNull(id)) {
					var _this = this;
					var url = this.Config.baseContext + '/mssq/mssqCatalog/getCatalogByVid';
					this.$http_post(url, {
						catalogVid: id
					}).then(ret => {
						let cataLogInfo = {};
						if (this.$route.query.type === 'addChildCata') {
							cataLogInfo = {
								parentName: ret.row.catalogName,
								parentCode: ret.row.catalogCode,
								id: '', //主键id
								"catalogCode": "",
								"catalogName": "",
								"manageType": '',
								"level": ret.row.level,
								"primaryIndex": ret.row.primaryIndex,
								"primaryIndexName": ret.row.primaryIndexName,
								origin: 'shenzhen', //来源
								parentId: ret.row.id, //父项编码
							};
						} else {
							let row = ret.row;
							for (let i in row) {
								if (row[i] === null) {
									row[i] = '';
								}
							}
							cataLogInfo = ret.row;
							if(this.$route.query.type == 'edit'){
								this.getPrimaryIndex(2, '', cataLogInfo.primaryIndex);
							}
							// cataLogInfo.catalogCode = cataLogInfo.catalogCode.substring(cataLogInfo.parentCode.length, cataLogInfo.catalogCode.length);
							// cataLogInfo.parentCode = cataLogInfo.parentCode.substring(cataLogInfo.primaryIndex.length, cataLogInfo.parentCode.length);
						}
						_this.cataLogInfo = cataLogInfo;
						this.$nextTick(()=>{
							this.firstInto = false;
						});
						/*-----------------------加载底部按钮----------------------*/
						var status = _this.cataLogInfo.status;
						var type = this.$route.query.type;
            if(!type && (status == 'EXAMINE_WAIT' || status == 'APPROVAL_WAIT')){
              type = 'todo'
            }else if(!type && (status === 'DRAF' || status === 'APPROVAL_FAIL' || status === 'EXAMINE_FAIL')){
              type = 'edit'
            }
						//查看,加载返回按钮
						if (this.isNotNull(type) && type == 'view') {
							this.proEdit = false;
							this.initOptMethod("defaultOpt")
						} else if (this.isNotNull(type) && type == 'todo') {
							this.proEdit = false;
							if (status === 'APPROVAL_WAIT') { //待办页面进入时，待审核状态type=todo加载审批按钮
								this.initOptMethod("accept")
							} else if (status === 'DRAF' || status === 'APPROVAL_FAIL' || status ===
								'EXAMINE_FAIL') {
								this.initOptMethod("newCatalog");
								this.canEdit = true;
							} else if (status === 'EXAMINE_WAIT') {
								this.initOptMethod("preExamina")
							} else {
								this.initOptMethod("defaultOpt")
							}
						} else { //edit(包含新增大项，添加小项，变更，编辑)
							// this.$route.query.pageType == 'edit' ? this.proEdit = false : '';
							this.canEdit = true;
							if (!this.isNotNull(status) || status === 'DRAF' || status === 'APPROVAL_FAIL' ||
								status === 'PUBLISH' || status === 'EXAMINE_FAIL') { //状态为空是新增
								this.initOptMethod("newCatalog")
							} else {
								this.initOptMethod("defaultOpt")
							}
						}
					});
				} else {
					// this.$route.query.pageType == 'edit' ? this.proEdit = false : '';
					this.cataLogInfo.id = '';
					this.canEdit = true;
					this.initOptMethod("newCatalog")
					this.$nextTick(()=>{
						this.firstInto = false;
					});
				}
			},
			getTableList() {
				const id = this.$route.query.id;
				if (this.isNotNull(id)) {
					var _this = this;
					var url = this.Config.baseContext + '/mssq/mssqItemIndex/getDutyItemListByCatalog';
					this.$http_post(url, {
						catalogVid: id,
						catalogId: this.cataLogInfo.catalogId,
						page: this.params.page,
						limit: this.params.limit,
					}).then(ret => {
						if(ret.state == 1){
							this.tableData = ret.rows;
							this.params.total = ret.records
						}
					});
				}
			},
			handleCurrentChange(data){
				this.params.page = data;
				this.getTableList();
			},
			childHeight() {
				//获取父级高度传递给子级
				this.parentHeight = this.$refs.getHeight.offsetHeight;
			},
			changeTabs() {
				this.parentHeight = 0;
			},
			getPrimaryIndex(type, params, parents) {
				let url = this.Config.baseContext + '/mssq/mssqCatalog/selectPrimaryIndex';
				let obj = {};
				this.$set(obj, params, '');
				obj.parentCode = parents;
				this.$http_post(url, obj).then(ret => {
					if (ret.state == 1) {
						// this.restaurants = JSON.parse(JSON.stringify(ret.rows));
						if (type == 1) {
							for (let i = 0; i < ret.rows.length; i++) {
								this.restaurants.push({
									value:ret.rows[i].code,
									name:ret.rows[i].name
								})
							}
							this.primaryIndexList = JSON.parse(JSON.stringify(ret.rows));
							this.newPrimaryIndexList = JSON.parse(JSON.stringify(ret.rows));
							return ret.rows
						} else {
							for (let i = 0; i < ret.rows.length; i++) {
								this.parrentResta.push({
									value:ret.rows[i].code,
									name:ret.rows[i].name
								})
							}
							this.parentIndexList = JSON.parse(JSON.stringify(ret.rows));
							this.newParentIndexList = JSON.parse(JSON.stringify(ret.rows));
						}
					}
				});
			},
			setName(val){
				this.primaryIndexList.some(item =>{
					if(item.code == val){
						this.cataLogInfo.primaryIndex = item.code;
						this.cataLogInfo.primaryIndexName = item.name;
						this.getPrimaryIndex(2,'',item.code)
					}
				});
				this.cataLogInfo.catalogCode = '';
				this.cataLogInfo.parentCode = '';
				this.newPrimaryIndexList = JSON.parse(JSON.stringify(this.primaryIndexList))
			},
			primaryBlur(){
				this.newPrimaryIndexList = JSON.parse(JSON.stringify(this.primaryIndexList))
			},
			parentBlur(){
				this.newParentIndexList = JSON.parse(JSON.stringify(this.parentIndexList))
			},
			setParentName(val){
				this.parentIndexList.some(item =>{
					if(item.code == val){
						this.cataLogInfo.parentName = item.name;
						this.cataLogInfo.parentCode = item.code;
					}
				});
				this.cataLogInfo.catalogCode = '';
				this.getCatalogValue();
				this.newParentIndexList = JSON.parse(JSON.stringify(this.parentIndexList))
			},
			getCatalogValue(){
				let url = this.Config.baseContext + '/mssq/mssqCatalog/gentCatalogCode';
				this.$http_post(url, {
					primaryIndex:this.cataLogInfo.primaryIndex,
					parentCode:this.cataLogInfo.parentCode,
          catalogId:this.cataLogInfo.catalogId || '',
				}).then(ret => {
					if (ret.state == 1) {
						this.cataLogInfo.catalogCode = ret.row;
					}
				});
			},
			searchPrimaryIndex(val){
				if(val){
					let arr = [];
					for (let i = 0; i <this.primaryIndexList.length ; i++) {
						if((this.primaryIndexList[i].code+this.primaryIndexList[i].name).indexOf(val)!= -1){
							arr.push(this.primaryIndexList[i]);
						}
					}
					this.newPrimaryIndexList = arr;
				}else{
					this.newPrimaryIndexList = JSON.parse(JSON.stringify(this.primaryIndexList))
				}
			},
			searchParentCode(val){
				if(val){
					let arr = [];
					for (let i = 0; i <this.parentIndexList.length ; i++) {
						if((this.parentIndexList[i].code+this.parentIndexList[i].name).indexOf(val)!= -1){
							arr.push(this.parentIndexList[i]);
						}
					}
					this.newParentIndexList = arr;
				}else{
					this.newParentIndexList = JSON.parse(JSON.stringify(this.parentIndexList))
				}
			},
			searchPrimaryIndexName(val) {
				if (val) {
					let arr = [];
					for (let i = 0; i < this.primaryIndexList.length; i++) {
						if ((this.primaryIndexList[i].name + this.primaryIndexList[i].name).indexOf(val) != -1) {
							arr.push(this.primaryIndexList[i]);
						}
					}
					this.newPrimaryIndexList = arr;
				} else {
					this.newPrimaryIndexList = JSON.parse(JSON.stringify(this.primaryIndexList))
				}
			},
			searchParentName(val) {
				if (val) {
					let arr = [];
					for (let i = 0; i < this.parentIndexList.length; i++) {
						if ((this.parentIndexList[i].name + this.parentIndexList[i].name).indexOf(val) != -1) {
							arr.push(this.parentIndexList[i]);
						}
					}
					this.newParentIndexList = arr;
				} else {
					this.newParentIndexList = JSON.parse(JSON.stringify(this.parentIndexList))
				}
			},
			querySearchAsync(queryString, cb) {

			/*	var restaurants = this.restaurants;
				var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {
					cb(results);
				}, 3000 * Math.random());*/
			},
			querySearchParent(queryString, cb) {
				var parrentResta = this.parrentResta;
				var results = queryString ? parrentResta.filter(this.createStateFilter(queryString)) : parrentResta;

				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {
					cb(results);
				}, 3000 * Math.random());
			},
			createStateFilter(queryString) {
				return (state) => {
					return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			},
			onEditItem(id, type) {
				//转跳事项梳理页面
				this.$router.push({
					path: '/qzqd/info',
					query: {
						id: id,
						type: 'view',
						qzqdName: 'qzqdName'
					}
				});
			},
			formatterPriority(row) {
				if ((!this.isEmptyObject(this.dictionary)) && this.dictionary.SSCJ.length > 0) {
					for (let i = 0; i < this.dictionary.SSCJ.length; i++) {
						if (this.dictionary.SSCJ[i].itemCode == row.level) {
							return this.dictionary.SSCJ[i].itemValue
						}
					}
				}
			},
			formatterManage(row) {
				if ((!this.isEmptyObject(this.dictionary)) && this.dictionary.manageType.length > 0) {
					for (let i = 0; i < this.dictionary.manageType.length; i++) {
						if (this.dictionary.manageType[i].itemCode == row.manageType) {
							return this.dictionary.manageType[i].itemValue
						}
					}
				}
			},
		},
		mounted() {
		 this.getPrimaryIndex(1);
			//获取数据字典
			this.uploadUrl = this.Config.rcPath + '/upload';
			this.queryDictMap('BUSI_TYPE,SSCJ,MANAGE_TYPE,OWNING_PLATFORM', this.setDictionary);
			this.onQuery();
		}
	}
</script>
<style lang="less" scoped>
	.cardView {
		padding: 10px 20px 10px 20px;
		&>div{
			background:#fff;
			min-height: 100%;
			padding:0 14px;
		}
		.view {
			height: calc(100vh - 270px);
			overflow: auto;

			/deep/ .el-tabs {
				height: 100%;

				.el-tabs__content {
					height: calc(100% - 60px);
					overflow: auto;

					.el-tab-pane {
						height: 100%;
					}
				}
			}
		}

		.el-form {
			.linkButton {
				float: right;
				font-size: 14px;
			}
		}

		.footer {
			width: 100%;
			height: 50px;
			position: relative;
			margin-top: 30px;

			div {
				position: absolute;
				left: 50%;
				top: 0;
				transform: translateX(-50%);

				/deep/ button {
					width: 120px !important;
				}
			}

			/deep/ .el-popover__reference-wrapper {
				padding: 0 10px;
			}
		}
	}

	.page-header.divider {
		border: none;
	}

	.page-header {
		margin-bottom: 10px;
	}

	.icon-tishi {
		color: #999;
		position: relative;
		top: 3px;
	}

	.qz-dialog-padding {
		/deep/ .el-dialog__body {
			.laws {
				padding: 0;

				/deep/ .el-table {
					.el-table__body-wrapper {
						max-height: calc(100vh - 400px) !important;
					}
				}
			}
		}
	}

	.select {

		/deep/ .el-form-item__content {
			.backColor {
				background: #f5f5f5;

			}

			.catalog {
				display: flex;
				border-radius: 4px;
				color: #606266;
				border: 1px solid #dcdfe6;

				.code {
					position: relative;
					left: 16px;
					white-space: nowrap;
					z-index: 100;
					padding-left: 16px;
					margin-left: -16px;
				}

				.catalogCodeDisabled {
					background-color: #f5f5f5;
					color: #606266;
				}

				.el-input {
					.el-input__inner {
						border: none;
					}
				}
			}

			.el-radio-group {
				margin: 0;
			}

			.selectChange {
				.el-input {
					.el-input__inner {
						background: #f5f5f5;
						color: #606266;
					}
				}
			}
		}

	}

	.inputDisabled {
    /*display:none;*/
      :deep(.el-input) {
        .el-input__inner {
          background: #f5f5f5;
          color: #606266;
        }
    }
    &.el-input{
      :deep(.el-input__inner) {
        background: #f5f5f5;
        color: #606266;
      }
    }
    &.el-textarea{
      :deep(.el-textarea__inner) {
        background: #f5f5f5;
        color: #606266;
      }
    }

	}
	.cellAll{
		width: 100%;
		overflow: auto;
		max-height: 300px;
	}
	.focusCell{
		width: 100%;
		padding: 10px 5px;
		cursor: pointer;
		&:hover{
			background: #ecf4fe;
		}
		&.active{
			background: #ecf4fe;
		}
	}

	.select-content{
		display: flex;
		justify-content: space-between;
		.addr{
			width: 70%;
			white-space: nowrap;
			text-overflow:ellipsis;
			overflow:hidden;
		}
	}
	.el-autocomplete{
		width: 100%;
		.el-input{
			width: 100%;
		}
	}
  .el-select{
    width: 100%;
    .el-input{
      width: 100%;
    }
  }
	.catalogInfoTable{
		display: flex;
		flex-direction: column;
		min-height: 400px;
		margin-top: 10px;
		padding: 6px 14px 14px 14px;
		background:#fff;
		.block{
			text-align: end;
			background: #fff;
			padding: 10px 0 0 0;
		}
	}
	.jump-title {
		min-height: 10px;
		min-width: 50px;
		display: inline-block;
		max-width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: var(--primary, #409eff);
		cursor: pointer;
		vertical-align: middle;
	}
	.info{
		display: flex;
		align-items: center;
		font-size: 16px;
		.imgClass{
			height: 20px;
			width: 20px;
		}
		span{
			padding-left: 8px;
		}
	}
</style>
